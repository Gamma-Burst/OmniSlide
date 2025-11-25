export type BlockType = 'text' | 'image' | 'code';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: any;
}

export interface Slide {
  id: string;
  title: string;
  blocks: ContentBlock[];
  notes: string;
  imagePrompt: string;
  layout: 'standard' | 'split' | 'hero';
}

export interface Project {
  id: string;
  title: string;
  topic: string;
  slides: Slide[];
  createdAt: string; // ISO String
  updatedAt: string;
  status: 'draft' | 'generating' | 'ready';
  thumbnailUrl?: string;
}

export interface User {
  uid: string;
  email: string;
  isPro: boolean;
  name?: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_STRUCTURE = 'GENERATING_STRUCTURE',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}
