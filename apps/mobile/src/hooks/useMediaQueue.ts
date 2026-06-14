import { useEffect, useMemo, useState } from 'react';

import { listMediaAssets, saveSwipeDecision } from '../services/mediaService';
import { MediaAsset, SwipeDecision } from '../types/media';

export function useMediaQueue() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listMediaAssets().then((items) => {
      setAssets(items);
      setIsLoading(false);
    });
  }, []);

  const currentAsset = assets[currentIndex];
  const progress = useMemo(
    () => ({
      reviewed: Math.min(currentIndex, assets.length),
      total: assets.length
    }),
    [assets.length, currentIndex]
  );

  async function decide(decision: SwipeDecision) {
    if (!currentAsset) {
      return;
    }

    await saveSwipeDecision(currentAsset.id, decision);
    setCurrentIndex((index) => index + 1);
  }

  return {
    currentAsset,
    decide,
    isComplete: !isLoading && currentIndex >= assets.length,
    isLoading,
    progress
  };
}
