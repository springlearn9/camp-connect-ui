export interface Notice {
  id: number;
  title: string;
  description?: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  category: 'ACADEMIC' | 'ADMINISTRATIVE' | 'EVENT' | 'GENERAL';
  validUntil?: string; // ISO date string
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  attachmentUrl?: string;
  postedById: number;
  postedByName?: string;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface NoticeRequest {
  title: string;
  description?: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  category: 'ACADEMIC' | 'ADMINISTRATIVE' | 'EVENT' | 'GENERAL';
  validUntil?: string; // ISO date string
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  attachmentUrl?: string;
  postedById: number;
}

export interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoticeCreated: () => void;
}

export interface EditNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoticeUpdated: () => void;
  notice: Notice;
}