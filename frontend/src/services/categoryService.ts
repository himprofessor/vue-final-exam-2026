import api from "./api";
import type { ApiResponse, Category, CategoryPayload } from "@/types";

export const categoryService = {
  getAll() {
    return api.get<ApiResponse<{ categories: Category[] }>>("/categories");
  },

  create(payload: CategoryPayload) {
    return api.post<ApiResponse<{ category: Category }>>(
      "/categories",
      payload,
    );
  },

  update(id: number, payload: CategoryPayload) {
    return api.put<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
      payload,
    );
  },

  remove(id: number) {
    return api.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};
