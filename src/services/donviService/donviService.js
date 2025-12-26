import api from "/src/lib/axios";

export const donviService = {
  getAllDonVi: async () => {
    const response = await api.get("/donvi");
    return response.data;
  },
  getDonViById: async (id) => {
    const response = await api.get(`/donvi/${id}`);
    return response.data;
  },
  createDonVi: async (donvi) => {
    const response = await api.post("/donvi", donvi);
    return response.data;
  },
  updateDonVi: async (id, donvi) => {
    const response = await api.put(`/donvi/${id}`, donvi);
    return response.data;
  },
  deleteDonVi: async (id) => {
    const response = await api.delete(`/donvi/${id}`);
    return response.data;
  },
   deleteManyDonVi: async (ids) => {
      const response = await api.delete(`/donvi`, { data: { ids } });
      return response.data;
    }
};