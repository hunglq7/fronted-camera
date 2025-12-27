import { create } from "zustand";
import{message} from 'antd'
import{khuvucService} from '/src/services/khuvucService/khuvucService'
export const useKhuVucStore = create((set, get) => ({
  khuvucs: [],
  loading: false,
    fetchKhuVucs: async () => {
    set({ loading: true });
    try {
      const data = await khuvucService.getAllKhuVuc();
      set({ khuvucs: data, loading: false });
    } catch (error) {
      message.error("Failed to fetch khuvucs");
      set({ loading: false });
    }
  },
  createKhuVuc: async (khuvuc) => {
    set({ loading: true });
    try {
      const data = await khuvucService.createKhuVuc(khuvuc);
      set({ khuvucs: [...get().khuvucs, data], loading: false });
    } catch (error) {
      message.error("Failed to create khuvuc");
      set({ loading: false });
    }
  },
  updateKhuVuc: async (id, khuvuc) => {
    set({ loading: true });
    try {
      const data = await khuvucService.updateKhuVuc(id, khuvuc);
      const updatedKhuVucs = get().khuvucs.map((dv) => (dv._id === id ? data : dv));
      set({ khuvucs: updatedKhuVucs, loading: false });
    } catch (error) {
      message.error("Failed to update khuvuc");
      set({ loading: false });
    }
    },
    deleteKhuVuc: async (id) => {
    set({ loading: true });
    try {
      await khuvucService.deleteKhuVuc(id);
        const filteredKhuVucs = get().khuvucs.filter((dv) => dv._id !== id);
      set({ khuvucs: filteredKhuVucs , loading: false });
    } catch (error) {
      message.error("Failed to delete khuvuc");
      set({ loading: false });
    }
  }
  ,
  deleteManyKhuVuc: async (ids) => {
  set({ loading: true });
  try {
    console.debug('khuvucStore.deleteManyKhuVuc -> ids:', ids);
    const res = await khuvucService.deleteManyKhuVuc(ids);
    console.debug('khuvucStore.deleteManyKhuVuc -> backend res:', res);
    set({ khuvucs: get().khuvucs.filter((dv) => !ids.includes(dv._id)), loading: false });
  } catch (error) {
    console.error('DELETE MANY KHU VUC ERROR:', error);
    message.error('Xóa nhiều thất bại');
    set({ loading: false });
  }
}
}));
