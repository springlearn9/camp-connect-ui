export interface Event {
  id: number;
  title: string;
  description?: string;
  eventDate: string; // ISO date string
  location: string;
  imageUrl?: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  postedById: number;
  postedByName?: string;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  eventDate: string; // ISO date string
  location: string;
  imageUrl?: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  postedById: number;
}

export interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
  event: Event;
}