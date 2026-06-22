export type MediaKind = 'photo' | 'video';

export type SwipeDecision = 'keep' | 'delete';

export type Tab = 'home' | 'swipe' | 'delete-bin' | 'history' | 'settings';

export type FlowScreen = 'auth' | 'onboarding' | 'permission' | null;

export type ModalScreen = 'cleanup-success' | 'deletion-success' | 'smart-cleanup' | 'premium' | null;

export type DeletionStats = {
  deletedCount: number;
  bytesFreed: number;
};

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  uri: string;
  thumbnailUri: string;
  createdAt: string;
  sizeBytes: number;
  durationSeconds?: number;
  album?: string;
  filename?: string;
  width?: number;
  height?: number;
};

export type SessionRecord = {
  id: string;
  date: string;
  keptCount: number;
  deletedCount: number;
  bytesFreed: number;
};

export type CleanupStats = {
  keptCount: number;
  deletedCount: number;
  bytesFreed: number;
};
