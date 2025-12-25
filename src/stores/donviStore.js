import { create } from "zustand";
import{message} from 'antd'
import { donviService } from "/src/services/donviService/donviService";
export const useDonViStore = create((set, get) => ({
  donvis: [],
  loading: false,
    fetchDonVis: async () => {
    set({ loading: true });
    try {
      const data = await donviService.getAllDonVi();
      set({ donvis: data, loading: false });
    } catch (error) {
      message.error("Failed to fetch donvis");
      set({ loading: false });
    }
  },
  createDonVi: async (donvi) => {
    set({ loading: true });
    try {
      const data = await donviService.createDonVi(donvi);
      set({ donvis: [...get().donvis, data], loading: false });
    } catch (error) {
      message.error("Failed to create donvi");
      set({ loading: false });
    }
  },
  updateDonVi: async (id, donvi) => {
    set({ loading: true });
    try {
      const data = await donviService.updateDonVi(id, donvi);
      const updatedDonvis = get().donvis.map((dv) => (dv.id === id ? data : dv));
      set({ donvis: updatedDonvis, loading: false });
    } catch (error) {
      message.error("Failed to update donvi");
      set({ loading: false });
    }
    },
    deleteDonVi: async (id) => {
    set({ loading: true });
    try {
      await donviService.deleteDonVi(id);
        const filteredDonvis = get().donvis.filter((dv) => dv.id !== id);
      set({ donvis: filteredDonvis, loading: false });
    } catch (error) {
      message.error("Failed to delete donvi");
      set({ loading: false });
    }
  },
  deleteMany: async (ids) => {
  set({ loading: true });
  try {
    await donviService.deleteMany(ids);
    set({
      donvis: get().donvis.filter((dv) => !ids.includes(dv.id)),
      loading: false
    });
  } catch {
    message.error('Xóa nhiều thất bại');
    set({ loading: false });
  }
}
}));
