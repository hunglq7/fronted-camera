import { create } from 'zustand';
import { message } from 'antd';
import { tonghoptbService } from '/src/services/tonghoptbService/tonghoptbService';

export const useTongHopTbStore = create((set, get) => ({
  tonghoptbs: [],
  loading: false,

  fetchTongHopTbs: async () => {
    set({ loading: true });
    try {
      const data = await tonghoptbService.getAllTongHopTb();
      set({ tonghoptbs: data, loading: false });
    } catch {
      message.error('Không tải được thiết bị');
      set({ loading: false });
    }
  },

  createTongHopTb: async (payload) => {
    const data = await tonghoptbService.createTongHopTb(payload);
    set({ tonghoptbs: [...get().tonghoptbs, data] });
  },

 updateTongHopTb: async (id, payload) => {
  await tonghoptbService.updateTongHopTb(id, payload);
  set({
    tonghoptbs: get().tonghoptbs.map((i) =>
      i._id === id ? { ...i, ...payload } : i
    )
  });
},

deleteTongHopTb: async (id) => {
  await tonghoptbService.deleteTongHopTb(id);
  set({
    tonghoptbs: get().tonghoptbs.filter((i) => i._id !== id)
  });
},

deleteManyTongHopTb: async (ids) => {
  await tonghoptbService.deleteManyTongHopTb(ids);
  set({
    tonghoptbs: get().tonghoptbs.filter((i) => !ids.includes(i._id))
  });
}
}));