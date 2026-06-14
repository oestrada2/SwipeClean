export type MediaKind = 'photo' | 'video';

export type SwipeDecision = 'keep' | 'delete';

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  uri: string;
  thumbnailUri: string;
  createdAt: string;
  sizeBytes: number;
  durationSeconds?: number;
};
