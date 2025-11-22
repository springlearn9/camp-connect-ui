export interface FoundItem {
  id: number;
  itemName: string;
  description?: string;
  location?: string;
  foundDate?: string; // ISO date string
  status: 'AVAILABLE' | 'CLAIMED' | 'VERIFIED' | 'EXPIRED';
  category: 'ELECTRONICS' | 'DOCUMENTS' | 'CLOTHING' | 'ACCESSORIES' | 'BOOKS' | 'OTHER';
  contactInfo?: string;
  photoUrl?: string;
  additionalImages?: string; // JSON array of image URLs
  distinctiveFeatures?: string;
  handoverLocation?: string;
  verificationRequired?: boolean;
  isAnonymous?: boolean;
  reportedById: number;
  reportedByName?: string;
  claimedByIds?: number[];
  claimedByNames?: string[];
  claimedAt?: string; // ISO date string
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface FoundItemRequest {
  itemName: string;
  description?: string;
  location?: string;
  foundDate?: string; // ISO date string
  status: 'AVAILABLE' | 'CLAIMED' | 'VERIFIED' | 'EXPIRED';
  category: 'ELECTRONICS' | 'DOCUMENTS' | 'CLOTHING' | 'ACCESSORIES' | 'BOOKS' | 'OTHER';
  contactInfo?: string;
  photoUrl?: string;
  additionalImages?: string; // JSON array of image URLs
  distinctiveFeatures?: string;
  handoverLocation?: string;
  verificationRequired?: boolean;
  isAnonymous?: boolean;
  reportedById: number;
}

export interface CreateFoundItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoundItemCreated: () => void;
}

export interface EditFoundItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoundItemUpdated: () => void;
  foundItem: FoundItem;
}