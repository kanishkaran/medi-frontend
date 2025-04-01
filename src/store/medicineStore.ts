import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Medicine {
  id: string;
  name: string;
  pack_size_label: string;
  price: number;
  image_url: string;
}

interface MedicineStoreState {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  clearMedicines: () => void;
}

export const useMedicineStore = create<MedicineStoreState>()(
  persist(
    (set) => ({
      medicines: [],
      addMedicine: (medicine) =>
        set((state) => {
          // Avoid duplicates by checking if the medicine already exists
          if (state.medicines.some((m) => m.id === medicine.id)) {
            return state;
          }
          return { medicines: [...state.medicines, medicine] };
        }),
      removeMedicine: (id) =>
        set((state) => ({
          medicines: state.medicines.filter((medicine) => medicine.id !== id),
        })),
      clearMedicines: () => set({ medicines: [] }),
    }),
    {
      name: 'medicine-storage', // Key for localStorage
    }
  )
);