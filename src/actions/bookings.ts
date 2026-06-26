"use server";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { calculateEndTime } from "@/lib/slots";
import { revalidatePath } from "next/cache";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function overlaps(startA: string, endA: string, startB: string, endB: string) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
}

export async function createBookingAction(formData: FormData) {
  const customerId = String(formData.get("customerId") || "").trim();
  const petId = String(formData.get("petId") || "").trim();
  const serviceId = String(formData.get("serviceId") || "").trim();
  const staffId = String(formData.get("staffId") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const startTime = String(formData.get("startTime") || "").trim();
  const couponCode = String(formData.get("couponCode") || "").trim();
  const totalPrice = Number(formData.get("totalPrice") || 0);
  const notes = String(formData.get("notes") || "").trim();
  const addOns = JSON.parse(String(formData.get("addOnsJson") || "[]"));

  if (!customerId || !petId || !serviceId || !staffId || !date || !startTime) {
    return { error: "Missing required booking details." };
  }

  const customerRef = doc(db, "customers", customerId);
  const petRef = doc(db, "customers", customerId, "pets", petId);
  const serviceRef = doc(db, "services", serviceId);
  const staffRef = doc(db, "staff", staffId);

  const [customerSnap, petSnap, serviceSnap, staffSnap] = await Promise.all([
    getDoc(customerRef),
    getDoc(petRef),
    getDoc(serviceRef),
    getDoc(staffRef),
  ]);

  if (!customerSnap.exists()) return { error: "Customer not found." };
  if (!petSnap.exists()) return { error: "Pet not found." };
  if (!serviceSnap.exists()) return { error: "Service not found." };
  if (!staffSnap.exists()) return { error: "Staff not found." };

  const customer = customerSnap.data();
  const pet = petSnap.data();
  const service = serviceSnap.data();
  const staff = staffSnap.data();

  const durationMinutes = Number(service.durationMinutes || 60);
  const endTime = calculateEndTime(startTime, durationMinutes);

  const conflictsQuery = query(
    collection(db, "bookings"),
    where("staffId", "==", staffId),
    where("date", "==", date)
  );

  const conflictsSnap = await getDocs(conflictsQuery);
  const conflicting = conflictsSnap.docs
    .map((item) => item.data())
    .filter((booking) => booking.status !== "cancelled")
    .some((booking) =>
      overlaps(startTime, endTime, booking.startTime, booking.endTime || booking.startTime)
    );

  if (conflicting) {
    return { error: "That slot was just booked. Please choose another time." };
  }

  const bookingRef = await addDoc(collection(db, "bookings"), {
    customerId,
    customerSnapshot: {
      name: customer.name,
      phone: customer.phone,
    },
    petId,
    petSnapshot: {
      name: pet.name,
      breed: pet.breed,
    },
    serviceId,
    serviceSnapshot: {
      name: service.name,
      basePrice: service.basePrice || 0,
    },
    addOns,
    staffId,
    staffSnapshot: {
      name: staff.name,
    },
    date,
    startTime,
    endTime,
    couponCode: couponCode || null,
    totalPrice,
    status: "pending",
    notes,
    createdAt: new Date().toISOString(),
  });

  await updateDoc(bookingRef, { id: bookingRef.id });
  await updateDoc(customerRef, {
    totalBookings: Number(customer.totalBookings || 0) + 1,
  });

  return { success: true, bookingId: bookingRef.id };
}


export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!bookingId) return { error: "Missing booking id." };

  const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    return { error: "Invalid status." };
  }

  await updateDoc(doc(db, "bookings", bookingId), {
    status,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/bookings");
  return { success: true };
}
