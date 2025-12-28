import api from '/src/lib/axios';

export const khuvucService = {
  getAllKhuVuc: async () => {
    const response = await api.get('/khuvuc');
    return response.data;
  },
  getKhuVucId: async (id) => {
    const response = await api.get(`/khuvuc/${id}`);
    return response.data;
  },
  createKhuVuc: async (khuvuc) => {
    const response = await api.post('/khuvuc', khuvuc);
    return response.data;
  },
  updateKhuVuc: async (id, khuvuc) => {
    const response = await api.put(`/khuvuc/${id}`, khuvuc);
    return response.data;
  },
  deleteKhuVuc: async (id) => {
    const response = await api.delete(`/khuvuc/${id}`);
    return response.data;
  },
  deleteManyKhuVuc: async (ids) => {
    console.debug('khuvucService.deleteManyKhuVuc -> sending ids:', ids);
    const response = await api.delete(`/khuvuc/select`, { data: { ids } });
    console.debug('khuvucService.deleteManyKhuVuc -> response:', response.data);
    return response.data;
  }
};
