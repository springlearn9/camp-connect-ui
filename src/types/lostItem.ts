export interface LostItem {
  id: number;
  itemName: string;
  description?: string;
  location?: string;
  lostDate?: string; // ISO date string
  status: 'PENDING' | 'SEARCHING' | 'FOUND' | 'CLAIMED' | 'CLOSED';
  category: 'ELECTRONICS' | 'DOCUMENTS' | 'CLOTHING' | 'ACCESSORIES' | 'BOOKS' | 'OTHER';
  rewardAmount?: number;
  contactInfo?: string;
  imageUrl?: string;
  additionalImages?: string; // JSON array of image URLs
  urgent?: boolean;
  isAnonymous?: boolean;
  userId: number;
  userName?: string;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface LostItemRequest {
  itemName: string;
  description?: string;
  location?: string;
  lostDate?: string; // ISO date string
  status: 'PENDING' | 'SEARCHING' | 'FOUND' | 'CLAIMED' | 'CLOSED';
  category: 'ELECTRONICS' | 'DOCUMENTS' | 'CLOTHING' | 'ACCESSORIES' | 'BOOKS' | 'OTHER';
  rewardAmount?: number;
  contactInfo?: string;
  imageUrl?: string;
  additionalImages?: string; // JSON array of image URLs
  urgent?: boolean;
  isAnonymous?: boolean;
  userId: number;
}

export interface CreateLostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLostItemCreated: () => void;
}

export interface EditLostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLostItemUpdated: () => void;
  lostItem: LostItem;
}