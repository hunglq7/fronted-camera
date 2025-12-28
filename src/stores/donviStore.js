import { create } from 'zustand';
import { message } from 'antd';
import { donviService } from '/src/services/donviService/donviService';
export const useDonViStore = create((set, get) => ({
  donvis: [],
  loading: false,
  fetchDonVis: async () => {
    set({ loading: true });
    try {
      const data = await donviService.getAllDonVi();
      set({ donvis: data, loading: false });
    } catch (error) {
      message.error('Failed to fetch donvis');
      set({ loading: false });
    }
  },
  createDonVi: async (donvi) => {
    set({ loading: true });
    try {
      const data = await donviService.createDonVi(donvi);
      set({ donvis: [...get().donvis, data], loading: false });
    } catch (error) {
      message.error('Failed to create donvi');
      set({ loading: false });
    }
  },
  updateDonVi: async (id, donvi) => {
    set({ loading: true });
    try {
      const data = await donviService.updateDonVi(id, donvi);
      const updatedDonvis = get().donvis.map((dv) => (dv._id === id ? data : dv));
      set({ donvis: updatedDonvis, loading: false });
    } catch (error) {
      message.error('Failed to update donvi');
      set({ loading: false });
    }
  },
  deleteDonVi: async (id) => {
    set({ loading: true });
    try {
      await donviService.deleteDonVi(id);
      const filteredDonvis = get().donvis.filter((dv) => dv._id !== id);
      set({ donvis: filteredDonvis, loading: false });
    } catch (error) {
      message.error('Failed to delete donvi');
      set({ loading: false });
    }
  },
  deleteManyDonVi: async (ids) => {
    set({ loading: true });
    try {
      console.debug('donviStore.deleteManyDonVi -> ids:', ids);
      const res = await donviService.deleteManyDonVi(ids);
      console.debug('donviStore.deleteManyDonVi -> backend res:', res);
      set({
        donvis: get().donvis.filter((dv) => !ids.includes(dv._id)),
        loading: false
      });
    } catch (error) {
      console.error('DELETE MANY ERROR:', error);
      message.error('Xóa nhiều thất bại');
      set({ loading: false });
    }
  }
}));
