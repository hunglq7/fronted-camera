import { create } from 'zustand';
import { message } from 'antd';
import { thietbiService } from '/src/services/thietbiService/thietbiService';

export const useThietBiStore = create((set, get) => ({
  thietbis: [],
  loading: false,

  fetchThietBis: async () => {
    set({ loading: true });
    try {
      const data = await thietbiService.getAllThietBi();
      set({ thietbis: data, loading: false });
    } catch {
      message.error('Không tải được thiết bị');
      set({ loading: false });
    }
  },

  createThietBi: async (payload) => {
    const data = await thietbiService.createThietBi(payload);
    set({ thietbis: [...get().thietbis, data] });
  },

  updateThietBi: async (id, payload) => {
    await thietbiService.updateThietBi(id, payload);
    set({
      thietbis: get().thietbis.map((i) => (i._id === id ? { ...i, ...payload } : i))
    });
  },

  deleteThietBi: async (id) => {
    await thietbiService.deleteThietBi(id);
    set({ thietbis: get().thietbis.filter((i) => i._id !== id) });
  },
  deleteManyThietBi: async (ids) => {
    set({ loading: true });
    try {
      console.debug('thietbiStore.deleteManyThietBi -> ids:', ids);
      const res = await thietbiService.deleteManyThietBi(ids);
      console.debug('thietbiStore.deleteManyThietBi -> backend res:', res);
      set({ thietbis: get().thietbis.filter((i) => !ids.includes(i._id)), loading: false });
    } catch (error) {
      console.error('DELETE MANY THIET BI ERROR:', error);
      message.error('Xóa nhiều thất bại');
      set({ loading: false });
    }
  },
   uploadExcel: async (file) => {
    const data = await thietbiService.uploadExcel(file);
    // Sau khi upload, fetch lại danh sách
    await get().fetchThietBis();
    return data;
  }
}));
