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
  servicePrice: number;
  matchedWeightTier: any | null;
  totalPrice: number;
  hasHydrated: boolean;
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
  resolveServicePrice: () => void;
  resetBooking: () => void;
  setHasHydrated: (value: boolean) => void;
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
  servicePrice: 0,
  matchedWeightTier: null,
  totalPrice: 0,
  hasHydrated: false,
};

function normalizeNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function resolveWeightTier(service: any, pet: PetState | null) {
  if (!service || service.pricingModel !== "WEIGHT_BASED") return null;
  if (!pet) return null;

  const petWeight = normalizeNumber(pet.weight);
  const tiers = Array.isArray(service.weightTiers) ? service.weightTiers : [];

  return (
    tiers.find((tier: any) => {
      const min = normalizeNumber(tier.minKg);
      const max = normalizeNumber(tier.maxKg);
      return petWeight >= min && petWeight <= max;
    }) || null
  );
}

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: Math.min(5, state.step + 1) })),
      prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

      setService: (service) => {
        set({ service });
        get().resolveServicePrice();
        get().calculateTotal();
      },

      setCustomer: (customer) =>
        set((state) => ({
          customer: { ...state.customer, ...customer },
        })),

      setSelectedPet: (pet) => {
        set({ selectedPet: pet });
        get().resolveServicePrice();
        get().calculateTotal();
      },

      updateSelectedPet: (pet) => {
        set((state) => ({
          selectedPet: state.selectedPet ? { ...state.selectedPet, ...pet } : null,
        }));
        get().resolveServicePrice();
        get().calculateTotal();
      },

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

        get().calculateTotal();
      },

      setSelectedStaffId: (staffId) => set({ selectedStaffId: staffId }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setCouponCode: (code) => set({ couponCode: code }),
      setCouponDiscount: (amount) => {
        set({ couponDiscount: amount });
        get().calculateTotal();
      },
      setNotes: (notes) => set({ notes }),

      resolveServicePrice: () => {
        const { service, selectedPet } = get();

        if (!service) {
          set({ servicePrice: 0, matchedWeightTier: null });
          return;
        }

        if (service.pricingModel === "WEIGHT_BASED") {
          const matchedTier = resolveWeightTier(service, selectedPet);
          const price = normalizeNumber(matchedTier?.price);
          set({
            matchedWeightTier: matchedTier,
            servicePrice: price,
          });
          return;
        }

        set({
          matchedWeightTier: null,
          servicePrice: normalizeNumber(service.basePrice),
        });
      },

      calculateTotal: () => {
        const { servicePrice, selectedAddOns, couponDiscount } = get();

        const addOnsTotal = selectedAddOns.reduce(
          (sum, item) => sum + normalizeNumber(item.price),
          0
        );

        const total = Math.max(
          0,
          normalizeNumber(servicePrice) + addOnsTotal - normalizeNumber(couponDiscount)
        );

        set({ totalPrice: total });
      },

      resetBooking: () => set(initialState),
    }),
    {
      name: "petromus-booking-store",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          return {
            ...persistedState,
            servicePrice: 0,
            matchedWeightTier: null,
            totalPrice: 0,
            hasHydrated: false,
          };
        }
        return persistedState;
      },
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
        servicePrice: state.servicePrice,
        matchedWeightTier: state.matchedWeightTier,
        totalPrice: state.totalPrice,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.resolveServicePrice();
        state?.calculateTotal();
      },
    }
  )
);