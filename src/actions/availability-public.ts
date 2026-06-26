"use server";

import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateAvailableSlots } from "@/lib/slots";

export async function getAvailableSlotsAction(formData: FormData) {
  const staffId = String(formData.get("staffId") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const serviceId = String(formData.get("serviceId") || "").trim();

  if (!staffId || !date || !serviceId) {
    return { error: "Missing required data." };
  }

  const staffSnap = await getDoc(doc(db, "staff", staffId));
  const serviceSnap = await getDoc(doc(db, "services", serviceId));

  if (!staffSnap.exists()) return { error: "Staff not found." };
  if (!serviceSnap.exists()) return { error: "Service not found." };

  const staff = staffSnap.data();
  const service = serviceSnap.data();

  const bookingsQuery = query(
    collection(db, "bookings"),
    where("staffId", "==", staffId),
    where("date", "==", date)
  );

  const bookingsSnap = await getDocs(bookingsQuery);

  const existingBookings = bookingsSnap.docs
    .map((item) => item.data())
    .filter((booking) => booking.status !== "cancelled");

  const durationMinutes = Number(service.durationMinutes || 60);

  const slots = generateAvailableSlots({
    date,
    availability: staff.availability || {},
    durationMinutes,
    existingBookings: existingBookings.map((item) => ({
      startTime: item.startTime,
      endTime: item.endTime,
    })),
  });

  return {
    success: true,
    slots,
    debug: {
      staffId,
      date,
      durationMinutes,
      availability: staff.availability || {},
    },
  };
}