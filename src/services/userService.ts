import api from "@/lib/axios";
import { User } from "@/types";

export const userService = {
  getUser: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/api/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/api/users/${userId}`, data);
    return response.data;
  }
};
