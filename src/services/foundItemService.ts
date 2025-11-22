import axios from 'axios';
import type { FoundItem, FoundItemRequest } from '../types/foundItem';

class FoundItemService {
  private apiClient = axios.create({
    baseURL: '/api/campus/found-items',
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

  async create(foundItemRequest: FoundItemRequest): Promise<FoundItem> {
    try {
      const response = await this.apiClient.post<FoundItem>('', foundItemRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create found item';
      throw new Error(errorMessage);
    }
  }

  async getAll(): Promise<FoundItem[]> {
    try {
      const response = await this.apiClient.get<FoundItem[]>('');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch found items';
      throw new Error(errorMessage);
    }
  }

  async getById(foundItemId: number): Promise<FoundItem> {
    try {
      const response = await this.apiClient.get<FoundItem>(`/${foundItemId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch found item';
      throw new Error(errorMessage);
    }
  }

  async getAvailable(): Promise<FoundItem[]> {
    try {
      const response = await this.apiClient.get<FoundItem[]>('/available');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch available found items';
      throw new Error(errorMessage);
    }
  }

  async getByStatus(status: string): Promise<FoundItem[]> {
    try {
      const response = await this.apiClient.get<FoundItem[]>(`/status/${status}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch found items by status';
      throw new Error(errorMessage);
    }
  }

  async getByCategory(category: string): Promise<FoundItem[]> {
    try {
      const response = await this.apiClient.get<FoundItem[]>(`/category/${category}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch found items by category';
      throw new Error(errorMessage);
    }
  }

  async getByReportedBy(reportedById: number): Promise<FoundItem[]> {
    try {
      const response = await this.apiClient.get<FoundItem[]>(`/reported-by/${reportedById}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch found items by reporter';
      throw new Error(errorMessage);
    }
  }

  async searchByItemName(itemName: string): Promise<FoundItem[]> {
    try {
      const response = await this.apiClient.get<FoundItem[]>(`/search`, {
        params: { itemName }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search found items';
      throw new Error(errorMessage);
    }
  }

  async update(foundItemId: number, foundItemRequest: FoundItemRequest): Promise<FoundItem> {
    try {
      const response = await this.apiClient.put<FoundItem>(`/${foundItemId}`, foundItemRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update found item';
      throw new Error(errorMessage);
    }
  }

  async delete(foundItemId: number): Promise<void> {
    try {
      await this.apiClient.delete(`/${foundItemId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete found item';
      throw new Error(errorMessage);
    }
  }
}

export const foundItemService = new FoundItemService();