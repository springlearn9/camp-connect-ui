import axios from 'axios';
import type { LostItem, LostItemRequest } from '../types/lostItem';

class LostItemService {
  private apiClient = axios.create({
    baseURL: '/api/campus/lost-items',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    // Add request interceptor to include token
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }
    );
  }

  async create(lostItemRequest: LostItemRequest): Promise<LostItem> {
    try {
      const response = await this.apiClient.post<LostItem>('', lostItemRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create lost item';
      throw new Error(errorMessage);
    }
  }

  async getAll(): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>('');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lost items';
      throw new Error(errorMessage);
    }
  }

  async getById(lostItemId: number): Promise<LostItem> {
    try {
      const response = await this.apiClient.get<LostItem>(`/${lostItemId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lost item';
      throw new Error(errorMessage);
    }
  }

  async getActive(): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>('/active');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch active lost items';
      throw new Error(errorMessage);
    }
  }

  async getUrgent(): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>('/urgent');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch urgent lost items';
      throw new Error(errorMessage);
    }
  }

  async getByStatus(status: string): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>(`/status/${status}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lost items by status';
      throw new Error(errorMessage);
    }
  }

  async getByCategory(category: string): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>(`/category/${category}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lost items by category';
      throw new Error(errorMessage);
    }
  }

  async getByReportedBy(reportedById: number): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>(`/reported-by/${reportedById}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lost items by reporter';
      throw new Error(errorMessage);
    }
  }

  async searchByItemName(itemName: string): Promise<LostItem[]> {
    try {
      const response = await this.apiClient.get<LostItem[]>(`/search`, {
        params: { itemName }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search lost items';
      throw new Error(errorMessage);
    }
  }

  async update(lostItemId: number, lostItemRequest: LostItemRequest): Promise<LostItem> {
    try {
      const response = await this.apiClient.put<LostItem>(`/${lostItemId}`, lostItemRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update lost item';
      throw new Error(errorMessage);
    }
  }

  async delete(lostItemId: number): Promise<void> {
    try {
      await this.apiClient.delete(`/${lostItemId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete lost item';
      throw new Error(errorMessage);
    }
  }
}

export const lostItemService = new LostItemService();