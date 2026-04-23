import api from "@/lib/axios";
import { Service, Company } from "@/types";

export const serviceService = {
    getServices: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>("/service");
    return response.data;
  },

    getServiceById: async (id: number): Promise<Company> => {
    const response = await api.get<Company>(`/service/${id}`);
    return response.data;
  },

    searchServices: async (query: string): Promise<Service[]> => {
    try {
      const response = await api.get<Service[]>(`/service/${encodeURIComponent(query)}`);
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [response.data as unknown as Service];
    } catch {
      
      const all = await serviceService.getServices();
      return all.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
};
