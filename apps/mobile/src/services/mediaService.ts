import { mockMedia } from './mockMedia';
import { MediaAsset, SwipeDecision } from '../types/media';

export async function listMediaAssets(): Promise<MediaAsset[]> {
  return mockMedia;
}

export async function saveSwipeDecision(assetId: string, decision: SwipeDecision) {
  return {
    assetId,
    decision,
    savedAt: new Date().toISOString()
  };
}
