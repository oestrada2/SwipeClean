import type { CleanupCategory, CleanupSettings, MediaAsset, SessionRecord } from './types';

export const mockMedia: MediaAsset[] = [
  {
    id: 'photo-001',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    createdAt: '2026-05-14T15:22:00.000Z',
    sizeBytes: 3_820_000,
    album: 'Camera',
    filename: 'IMG_0042.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-002',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800',
    createdAt: '2026-05-15T18:45:00.000Z',
    sizeBytes: 5_140_000,
    album: 'Camera',
    filename: 'IMG_0043.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'video-001',
    kind: 'video',
    uri: 'mock://video/beach',
    thumbnailUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    createdAt: '2026-05-17T11:04:00.000Z',
    sizeBytes: 84_000_000,
    durationSeconds: 32,
    album: 'Camera',
    filename: 'VID_0012.mp4',
    width: 1920,
    height: 1080,
  },
  {
    id: 'photo-003',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800',
    createdAt: '2026-05-18T09:10:00.000Z',
    sizeBytes: 2_950_000,
    album: 'Screenshots',
    filename: 'Screenshot_20260518.jpg',
    width: 1080,
    height: 2400,
  },
  {
    id: 'photo-004',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
    createdAt: '2026-05-19T14:32:00.000Z',
    sizeBytes: 6_200_000,
    album: 'Camera',
    filename: 'IMG_0044.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-005',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800',
    createdAt: '2026-05-20T07:55:00.000Z',
    sizeBytes: 4_480_000,
    album: 'WhatsApp',
    filename: 'WA0023.jpg',
    width: 2048,
    height: 1536,
  },
  {
    id: 'video-002',
    kind: 'video',
    uri: 'mock://video/mountains',
    thumbnailUri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    createdAt: '2026-05-21T16:20:00.000Z',
    sizeBytes: 142_000_000,
    durationSeconds: 87,
    album: 'Camera',
    filename: 'VID_0013.mp4',
    width: 1920,
    height: 1080,
  },
  {
    id: 'photo-006',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=800',
    createdAt: '2026-05-22T11:15:00.000Z',
    sizeBytes: 3_100_000,
    album: 'Downloads',
    filename: 'download_001.jpg',
    width: 1920,
    height: 1280,
  },
  {
    id: 'photo-007',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800',
    createdAt: '2026-05-23T20:40:00.000Z',
    sizeBytes: 7_800_000,
    album: 'Camera',
    filename: 'IMG_0045.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-008',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
    createdAt: '2026-05-24T13:05:00.000Z',
    sizeBytes: 5_560_000,
    album: 'Camera',
    filename: 'IMG_0046.jpg',
    width: 4032,
    height: 3024,
  },
  // June 2026 — current month + recents
  {
    id: 'photo-jun-001',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    createdAt: '2026-06-10T09:00:00.000Z',
    sizeBytes: 4_200_000,
    album: 'Camera',
    filename: 'IMG_0050.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-jun-002',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800',
    createdAt: '2026-06-15T16:20:00.000Z',
    sizeBytes: 3_750_000,
    album: 'Camera',
    filename: 'IMG_0051.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-jun-003',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1547581849-a2a671fc5e55?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1547581849-a2a671fc5e55?w=800',
    createdAt: '2026-06-20T11:45:00.000Z',
    sizeBytes: 5_100_000,
    album: 'Camera',
    filename: 'IMG_0052.jpg',
    width: 4032,
    height: 3024,
  },
  // On This Day — same month+day in prior years
  {
    id: 'photo-otd-001',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800',
    createdAt: '2025-06-22T10:15:00.000Z',
    sizeBytes: 3_400_000,
    album: 'Camera',
    filename: 'IMG_2025_0622.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-otd-002',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
    createdAt: '2024-06-22T14:30:00.000Z',
    sizeBytes: 4_600_000,
    album: 'Camera',
    filename: 'IMG_2024_0622.jpg',
    width: 4032,
    height: 3024,
  },
  // April 2026
  {
    id: 'photo-apr-001',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800',
    createdAt: '2026-04-05T11:00:00.000Z',
    sizeBytes: 2_880_000,
    album: 'Camera',
    filename: 'IMG_0047.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-apr-002',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800',
    createdAt: '2026-04-18T08:30:00.000Z',
    sizeBytes: 3_300_000,
    album: 'Camera',
    filename: 'IMG_0048.jpg',
    width: 3024,
    height: 4032,
  },
  // March 2026
  {
    id: 'photo-mar-001',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
    createdAt: '2026-03-12T15:00:00.000Z',
    sizeBytes: 6_100_000,
    album: 'Camera',
    filename: 'IMG_0049.jpg',
    width: 4032,
    height: 3024,
  },
  {
    id: 'photo-mar-002',
    kind: 'photo',
    uri: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200',
    thumbnailUri: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
    createdAt: '2026-03-28T19:20:00.000Z',
    sizeBytes: 4_900_000,
    album: 'WhatsApp',
    filename: 'WA0031.jpg',
    width: 2048,
    height: 1536,
  },
];

export const mockHistory: SessionRecord[] = [
  {
    id: 'session-001',
    date: '2026-06-19T10:00:00.000Z',
    keptCount: 24,
    deletedCount: 18,
    bytesFreed: 312_000_000,
  },
  {
    id: 'session-002',
    date: '2026-06-15T15:30:00.000Z',
    keptCount: 31,
    deletedCount: 9,
    bytesFreed: 98_000_000,
  },
  {
    id: 'session-003',
    date: '2026-06-10T09:15:00.000Z',
    keptCount: 45,
    deletedCount: 27,
    bytesFreed: 481_000_000,
  },
  {
    id: 'session-004',
    date: '2026-06-01T19:45:00.000Z',
    keptCount: 12,
    deletedCount: 33,
    bytesFreed: 756_000_000,
  },
];

export function getMockAlbums(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const asset of mockMedia) {
    if (asset.album) {
      counts.set(asset.album, (counts.get(asset.album) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function applySettings(
  assets: MediaAsset[],
  settings?: CleanupSettings,
  skipProtection = false
): MediaAsset[] {
  if (!settings) return assets;
  let result = assets;

  if (settings.mediaTypeFilter !== 'all') {
    switch (settings.mediaTypeFilter) {
      case 'photos':
        result = result.filter((a) => a.kind === 'photo' && a.album !== 'Screenshots');
        break;
      case 'videos':
        result = result.filter((a) => a.kind === 'video');
        break;
      case 'screenshots':
        result = result.filter((a) => a.album === 'Screenshots');
        break;
    }
  }

  if (!skipProtection && settings.protectedAlbums.length > 0) {
    const protectedSet = new Set(settings.protectedAlbums);
    result = result.filter((a) => !protectedSet.has(a.album ?? ''));
  }

  result = [...result];
  switch (settings.sortOrder) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'largest':
      result.sort((a, b) => b.sizeBytes - a.sizeBytes);
      break;
  }

  return result;
}

export function filterMedia(
  category: CleanupCategory | null,
  album?: string | null,
  settings?: CleanupSettings
): MediaAsset[] {
  if (!category) return applySettings(mockMedia, settings);

  const now = new Date();
  let result: MediaAsset[] = mockMedia;

  switch (category) {
    case 'all-photos':
      result = mockMedia;
      break;
    case 'photos-only':
      result = mockMedia.filter((a) => a.kind === 'photo');
      break;
    case 'videos-only':
      result = mockMedia.filter((a) => a.kind === 'video');
      break;
    case 'recents': {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 30);
      result = mockMedia.filter((a) => new Date(a.createdAt) >= cutoff);
      break;
    }
    case 'on-this-day': {
      result = mockMedia.filter((a) => {
        const d = new Date(a.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate() &&
          d.getFullYear() < now.getFullYear()
        );
      });
      break;
    }
    case 'screenshots':
      result = mockMedia.filter((a) => a.album === 'Screenshots');
      break;
    case 'large-videos':
      result = mockMedia.filter((a) => a.kind === 'video');
      break;
    case 'albums':
      result = album ? mockMedia.filter((a) => a.album === album) : mockMedia;
      break;
    case 'smart-cleanup':
      result = mockMedia;
      break;
    default: {
      if (category.startsWith('month-')) {
        const offset = parseInt(category.replace('month-', ''), 10);
        const target = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        result = mockMedia.filter((a) => {
          const d = new Date(a.createdAt);
          return (
            d.getMonth() === target.getMonth() &&
            d.getFullYear() === target.getFullYear()
          );
        });
      }
    }
  }

  return applySettings(result, settings, category === 'albums' && !!album);
}
