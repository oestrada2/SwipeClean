export type MediaKind = 'photo' | 'video';
export type Tab = 'home' | 'swipe' | 'bin' | 'history';

export type SortOrder = 'newest' | 'oldest' | 'largest';
export type MediaTypeFilter = 'all' | 'photos' | 'videos' | 'screenshots';
export type AppearanceMode = 'system' | 'light' | 'dark';

export type NotificationSettings = {
  weeklyReminders: boolean;
  monthlyReminders: boolean;
  screenshotReminders: boolean;
  largeVideoReminders: boolean;
  smartCleanupSuggestions: boolean;
  maxTwoPerWeek: boolean;
};

export type CleanupSettings = {
  sortOrder: SortOrder;
  mediaTypeFilter: MediaTypeFilter;
  hapticFeedback: boolean;
  appearance: AppearanceMode;
  protectedAlbums: string[];
  notifications: NotificationSettings;
};

export const DEFAULT_CLEANUP_SETTINGS: CleanupSettings = {
  sortOrder: 'newest',
  mediaTypeFilter: 'all',
  hapticFeedback: true,
  appearance: 'system',
  protectedAlbums: [],
  notifications: {
    weeklyReminders: true,
    monthlyReminders: false,
    screenshotReminders: false,
    largeVideoReminders: false,
    smartCleanupSuggestions: false,
    maxTwoPerWeek: true,
  },
};

export type CleanupCategory =
  | 'all-photos'
  | 'on-this-day'
  | 'recents'
  | 'photos-only'
  | 'videos-only'
  | 'month-0'
  | 'month-1'
  | 'month-2'
  | 'month-3'
  | 'screenshots'
  | 'large-videos'
  | 'albums'
  | 'smart-cleanup';

export const PREMIUM_CATEGORIES = new Set<CleanupCategory>([
  'smart-cleanup',
  'large-videos',
]);

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
