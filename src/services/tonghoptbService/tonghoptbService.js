import api from "/src/lib/axios";
export const tonghoptbService = {
  getAllTongHopTb: async () => {
    const response = await api.get("/tonghoptb");
    return response.data;
  },
  getTongHopTbById: async (id) => {
    const response = await api.get(`/tonghoptb/${id}`);
    return response.data;
  },
  createTongHopTb: async (tonghoptb) => {
    const response = await api.post("/tonghoptb", tonghoptb);
    return response.data;
  },
  updateTongHopTb: async (id, tonghoptb) => {
    const response = await api.put(`/tonghoptb/${id}`, tonghoptb);
    return response.data;
  },
  deleteTongHopTb: async (id) => {
    const response = await api.delete(`/tonghoptb/${id}`);
    return response.data;
  },
    deleteManyTongHopTb: async (ids) => {
    const response = await api.delete(`/tonghoptb`, { data: { ids } });
    return response.data;
  }

};