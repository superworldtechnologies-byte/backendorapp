"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

export type CustomerProfile = {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  totalVisits: number;
  lastVisit: string | null;
  createdAt: string | null;
  devices: Array<{
    platform?: string;
    phone?: string;
    fcmToken?: string;
    notificationsEnabled?: boolean;
    updatedAt?: string;
    isPWAInstalled?: boolean;
  }>;
};

export type CustomerPet = {
  id: string;
  name: string;
  breed: string;
  age: number | null;
  size: string;
  weight: number | null;
  vaccinated: boolean;
  behaviorNotes: string;
  stylePreference: string;
  photoThumbBase64: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CustomerBooking = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  totalPrice: number;
  serviceId: string;
  serviceName: string;
  staffName: string;
  petId: string;
  petName: string;
  petBreed: string;
  addOns: Array<{
    id: string;
    name: string;
    price: string | number;
    durationMinutes?: string;
    active?: boolean;
  }>;
  updatedAt: string | null;
};

export type ReviewItem = {
  id: string;
  title: string;
  body: string;
  rating: number;
  createdAt: string | null;
};

async function getCustomerPhoneFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("customerPhone")?.value || null;
}

async function requireCustomerPhone() {
  const phone = await getCustomerPhoneFromCookie();
  if (!phone) {
    throw new Error("Customer session not found.");
  }
  return phone;
}

export async function getCustomerProfileAction(): Promise<{
  customer: CustomerProfile | null;
  reviews: ReviewItem[];
}> {
  const phone = await requireCustomerPhone();
  const customerRef = doc(db, "customers", phone);
  const customerSnap = await getDoc(customerRef);

  if (!customerSnap.exists()) {
    return { customer: null, reviews: [] };
  }

  const data = customerSnap.data() as any;
  const reviewsSnap = await getDocs(collection(db, "customers", phone, "reviews"));

  const reviews: ReviewItem[] = reviewsSnap.docs.map((reviewDoc) => {
    const review = reviewDoc.data() as any;
    return {
      id: reviewDoc.id,
      title: review.title || "Customer review",
      body: review.body || review.comment || review.message || "",
      rating: Number(review.rating || 0),
      createdAt: review.createdAt || null,
    };
  });

  return {
    customer: {
      id: data.id || phone,
      name: data.name || "Customer",
      phone: data.phone || phone,
      totalBookings: Number(data.totalBookings || 0),
      totalVisits: Number(data.totalVisits || 0),
      lastVisit: data.lastVisit || null,
      createdAt: data.createdAt || null,
      devices: Array.isArray(data.devices) ? data.devices : [],
    },
    reviews,
  };
}

export async function getCustomerPetsAction(): Promise<CustomerPet[]> {
  const phone = await requireCustomerPhone();
  const petsQuery = query(collection(db, "customers", phone, "pets"), orderBy("createdAt", "desc"));
  const snap = await getDocs(petsQuery);

  return snap.docs.map((petDoc) => {
    const pet = petDoc.data() as any;
    return {
      id: pet.id || petDoc.id,
      name: pet.name || "Unnamed pet",
      breed: pet.breed || "—",
      age: typeof pet.age === "number" ? pet.age : null,
      size: pet.size || "—",
      weight: typeof pet.weight === "number" ? pet.weight : null,
      vaccinated: Boolean(pet.vaccinated),
      behaviorNotes: pet.behaviorNotes || "",
      stylePreference: pet.stylePreference || "",
      photoThumbBase64: pet.photoThumbBase64 || "",
      createdAt: pet.createdAt || null,
      updatedAt: pet.updatedAt || null,
    };
  });
}

export async function getPetDetailsAction(petId: string): Promise<{
  pet: CustomerPet | null;
  bookings: CustomerBooking[];
}> {
  const phone = await requireCustomerPhone();
  const petRef = doc(db, "customers", phone, "pets", petId);
  const petSnap = await getDoc(petRef);

  if (!petSnap.exists()) {
    return { pet: null, bookings: [] };
  }

  const pet = petSnap.data() as any;
  const bookingsSnap = await getDocs(query(collection(db, "bookings"), orderBy("date", "desc")));

  const bookings = bookingsSnap.docs
    .map((bookingDoc) => {
      const booking = bookingDoc.data() as any;
      return {
        id: booking.id || bookingDoc.id,
        customerId: booking.customerId,
        petId: booking.petId,
        date: booking.date || "",
        startTime: booking.startTime || "",
        endTime: booking.endTime || "",
        status: booking.status || "pending",
        notes: booking.notes || "",
        totalPrice: Number(booking.totalPrice || 0),
        serviceId: booking.serviceId || "",
        serviceName: booking.serviceSnapshot?.name || "Service",
        staffName: booking.staffSnapshot?.name || "—",
        petName: booking.petSnapshot?.name || "Pet",
        petBreed: booking.petSnapshot?.breed || "—",
        addOns: Array.isArray(booking.addOns) ? booking.addOns : [],
        updatedAt: booking.updatedAt || null,
      };
    })
    .filter((booking) => booking.customerId === phone && booking.petId === petId);

  return {
    pet: {
      id: pet.id || petSnap.id,
      name: pet.name || "Unnamed pet",
      breed: pet.breed || "—",
      age: typeof pet.age === "number" ? pet.age : null,
      size: pet.size || "—",
      weight: typeof pet.weight === "number" ? pet.weight : null,
      vaccinated: Boolean(pet.vaccinated),
      behaviorNotes: pet.behaviorNotes || "",
      stylePreference: pet.stylePreference || "",
      photoThumbBase64: pet.photoThumbBase64 || "",
      createdAt: pet.createdAt || null,
      updatedAt: pet.updatedAt || null,
    },
    bookings,
  };
}

export async function getCustomerBookingsAction(): Promise<CustomerBooking[]> {
  const phone = await requireCustomerPhone();
  const bookingsSnap = await getDocs(query(collection(db, "bookings"), orderBy("date", "desc")));

  return bookingsSnap.docs
    .map((bookingDoc) => {
      const booking = bookingDoc.data() as any;
      return {
        id: booking.id || bookingDoc.id,
        customerId: booking.customerId,
        date: booking.date || "",
        startTime: booking.startTime || "",
        endTime: booking.endTime || "",
        status: booking.status || "pending",
        notes: booking.notes || "",
        totalPrice: Number(booking.totalPrice || 0),
        serviceId: booking.serviceId || "",
        serviceName: booking.serviceSnapshot?.name || "Service",
        staffName: booking.staffSnapshot?.name || "—",
        petId: booking.petId || "",
        petName: booking.petSnapshot?.name || "Pet",
        petBreed: booking.petSnapshot?.breed || "—",
        addOns: Array.isArray(booking.addOns) ? booking.addOns : [],
        updatedAt: booking.updatedAt || null,
      };
    })
    .filter((booking: any) => booking.customerId === phone);
}