import axios from 'axios';
import type { Notice, NoticeRequest } from '../types/notice';

class NoticeService {
  private apiClient = axios.create({
    baseURL: '/api/campus/notices',
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

  async create(noticeRequest: NoticeRequest): Promise<Notice> {
    try {
      const response = await this.apiClient.post<Notice>('', noticeRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create notice';
      throw new Error(errorMessage);
    }
  }

  async getAll(): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>('');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notices';
      throw new Error(errorMessage);
    }
  }

  async getById(noticeId: number): Promise<Notice> {
    try {
      const response = await this.apiClient.get<Notice>(`/${noticeId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notice';
      throw new Error(errorMessage);
    }
  }

  async getActive(): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>('/active');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch active notices';
      throw new Error(errorMessage);
    }
  }

  async getHighPriority(): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>('/high-priority');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch high priority notices';
      throw new Error(errorMessage);
    }
  }

  async getByStatus(status: string): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>(`/status/${status}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notices by status';
      throw new Error(errorMessage);
    }
  }

  async getByCategory(category: string): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>(`/category/${category}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notices by category';
      throw new Error(errorMessage);
    }
  }

  async getByPriority(priority: string): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>(`/priority/${priority}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notices by priority';
      throw new Error(errorMessage);
    }
  }

  async getByPostedBy(postedById: number): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>(`/posted-by/${postedById}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notices by poster';
      throw new Error(errorMessage);
    }
  }

  async searchByTitle(title: string): Promise<Notice[]> {
    try {
      const response = await this.apiClient.get<Notice[]>(`/search`, {
        params: { title }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search notices';
      throw new Error(errorMessage);
    }
  }

  async update(noticeId: number, noticeRequest: NoticeRequest): Promise<Notice> {
    try {
      const response = await this.apiClient.put<Notice>(`/${noticeId}`, noticeRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update notice';
      throw new Error(errorMessage);
    }
  }

  async delete(noticeId: number): Promise<void> {
    try {
      await this.apiClient.delete(`/${noticeId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete notice';
      throw new Error(errorMessage);
    }
  }
}

export const noticeService = new NoticeService();