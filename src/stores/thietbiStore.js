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
   thietbis: get().thietbis.map((i) =>
     i.id === id ? { ...i, ...payload } : i
   )
});
  },

  deleteThietBi: async (id) => {
    await thietbiService.deleteThietBi(id);
    set({ thietbis: get().thietbis.filter((i) => i.id !== id) });
  },

  deleteManyThietbi: async (ids) => {
    await thietbiService.deleteManyThietbi(ids);
    set({ thietbis: get().thietbis.filter((i) => !ids.includes(i.id)) });
  }
}));