import axios from 'axios';
import type { Event, EventRequest } from '../types/event';

class EventService {
  private apiClient = axios.create({
    baseURL: '/api/campus/events',
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

  async create(eventRequest: EventRequest): Promise<Event> {
    try {
      const response = await this.apiClient.post<Event>('', eventRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create event';
      throw new Error(errorMessage);
    }
  }

  async getAll(): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>('');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch events';
      throw new Error(errorMessage);
    }
  }

  async getById(eventId: number): Promise<Event> {
    try {
      const response = await this.apiClient.get<Event>(`/${eventId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch event';
      throw new Error(errorMessage);
    }
  }

  async getUpcoming(): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>('/upcoming');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch upcoming events';
      throw new Error(errorMessage);
    }
  }

  async getByStatus(status: string): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>(`/status/${status}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch events by status';
      throw new Error(errorMessage);
    }
  }

  async getByPostedBy(postedById: number): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>(`/posted-by/${postedById}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch events by poster';
      throw new Error(errorMessage);
    }
  }

  async searchByTitle(title: string): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>(`/search/title`, {
        params: { title }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search events';
      throw new Error(errorMessage);
    }
  }

  async searchByLocation(location: string): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>(`/search/location`, {
        params: { location }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search events by location';
      throw new Error(errorMessage);
    }
  }

  async update(eventId: number, eventRequest: EventRequest): Promise<Event> {
    try {
      const response = await this.apiClient.put<Event>(`/${eventId}`, eventRequest);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update event';
      throw new Error(errorMessage);
    }
  }

  async delete(eventId: number): Promise<void> {
    try {
      await this.apiClient.delete(`/${eventId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete event';
      throw new Error(errorMessage);
    }
  }
}

export const eventService = new EventService();