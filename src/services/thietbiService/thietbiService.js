import api from '/src/lib/axios';
export const thietbiService = {
  getAllThietBi: async () => {
    const response = await api.get('/thietbi');
    return response.data;
  },
  getThietBiById: async (id) => {
    const response = await api.get(`/thietbi/${id}`);
    return response.data;
  },
  createThietBi: async (thietbi) => {
    const response = await api.post('/thietbi', thietbi);
    return response.data;
  },
  updateThietBi: async (id, thietbi) => {
    const response = await api.put(`/thietbi/${id}`, thietbi);
    return response.data;
  },
  deleteThietBi: async (id) => {
    const response = await api.delete(`/thietbi/${id}`);
    return response.data;
  },
  deleteManyThietBi: async (ids) => {
    console.debug('thietbiService.deleteManyThietBi -> sending ids:', ids);
    const response = await api.delete(`/thietbi/select`, { data: { ids } });
    console.debug('thietbiService.deleteManyThietBi -> response:', response.data);
    return response.data;
  }
};
