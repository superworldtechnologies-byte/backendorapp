"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CustomerState = {
  phone: string;
  name: string;
};

type PetState = {
  id?: string;
  name: string;
  breed: string;
  age: number | string;
  weight: number | string;
  size: string;
  vaccinated?: boolean | null;
  behaviorNotes?: string;
  stylePreference?: string;
  photoThumbBase64?: string;
};

type BookingState = {
  step: number;
  service: any | null;
  customer: CustomerState;
  selectedPet: PetState | null;
  selectedAddOns: any[];
  selectedStaffId: string;
  selectedDate: string;
  selectedTime: string;
  couponCode: string;
  couponDiscount: number;
  notes: string;
  totalPrice: number;
};

type BookingActions = {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (service: any) => void;
  setCustomer: (customer: Partial<CustomerState>) => void;
  setSelectedPet: (pet: PetState | null) => void;
  updateSelectedPet: (pet: Partial<PetState>) => void;
  toggleAddOn: (addon: any) => void;
  setSelectedStaffId: (staffId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setCouponCode: (code: string) => void;
  setCouponDiscount: (amount: number) => void;
  setNotes: (notes: string) => void;
  calculateTotal: () => void;
  resetBooking: () => void;
};

const initialState: BookingState = {
  step: 1,
  service: null,
  customer: {
    phone: "",
    name: "",
  },
  selectedPet: null,
  selectedAddOns: [],
  selectedStaffId: "",
  selectedDate: "",
  selectedTime: "",
  couponCode: "",
  couponDiscount: 0,
  notes: "",
  totalPrice: 0,
};

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: Math.min(5, state.step + 1) })),
      prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

      setService: (service) => {
        set({ service });
        setTimeout(() => get().calculateTotal(), 0);
      },

      setCustomer: (customer) =>
        set((state) => ({
          customer: { ...state.customer, ...customer },
        })),

      setSelectedPet: (pet) => set({ selectedPet: pet }),

      updateSelectedPet: (pet) =>
        set((state) => ({
          selectedPet: state.selectedPet
            ? { ...state.selectedPet, ...pet }
            : null,
        })),

      toggleAddOn: (addon) => {
        const exists = get().selectedAddOns.some((item) => item.id === addon.id);

        if (exists) {
          set({
            selectedAddOns: get().selectedAddOns.filter((item) => item.id !== addon.id),
          });
        } else {
          set({
            selectedAddOns: [...get().selectedAddOns, addon],
          });
        }

        setTimeout(() => get().calculateTotal(), 0);
      },

      setSelectedStaffId: (staffId) => set({ selectedStaffId: staffId }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setCouponCode: (code) => set({ couponCode: code }),
      setCouponDiscount: (amount) => {
        set({ couponDiscount: amount });
        setTimeout(() => get().calculateTotal(), 0);
      },
      setNotes: (notes) => set({ notes }),

      calculateTotal: () => {
        const { service, selectedAddOns, couponDiscount } = get();
        const basePrice = Number(service?.basePrice || 0);
        const addOnsTotal = selectedAddOns.reduce(
          (sum, item) => sum + Number(item.price || 0),
          0
        );
        const total = Math.max(0, basePrice + addOnsTotal - Number(couponDiscount || 0));
        set({ totalPrice: total });
      },

      resetBooking: () => set(initialState),
    }),
    {
      name: "petromus-booking-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        service: state.service,
        customer: state.customer,
        selectedPet: state.selectedPet,
        selectedAddOns: state.selectedAddOns,
        selectedStaffId: state.selectedStaffId,
        selectedDate: state.selectedDate,
        selectedTime: state.selectedTime,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        notes: state.notes,
        totalPrice: state.totalPrice,
      }),
    }
  )
);