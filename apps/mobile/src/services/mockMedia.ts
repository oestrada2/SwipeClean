import { MediaAsset } from '../types/media';

export const mockMedia: MediaAsset[] = [
  {
    id: 'photo-001',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    thumbnailUri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    createdAt: '2026-05-14T15:22:00.000Z',
    sizeBytes: 3_800_000
  },
  {
    id: 'photo-002',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
    thumbnailUri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800',
    createdAt: '2026-05-15T18:45:00.000Z',
    sizeBytes: 5_100_000
  },
  {
    id: 'video-001',
    kind: 'video',
    uri: 'mock://video/beach-cleanup',
    thumbnailUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    createdAt: '2026-05-17T11:04:00.000Z',
    sizeBytes: 84_000_000,
    durationSeconds: 32
  }
];
