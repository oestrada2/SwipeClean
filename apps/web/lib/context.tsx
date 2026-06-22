'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { mockHistory } from './mockData';
import { DEFAULT_CLEANUP_SETTINGS } from './types';
import type { CleanupCategory, CleanupSettings, DeletionStats, MediaAsset, SessionRecord, Tab } from './types';

type AppContextType = {
  activeTab: Tab;
  deleteBin: MediaAsset[];
  history: SessionRecord[];
  deletionStats: DeletionStats | null;
  cleanupCategory: CleanupCategory | null;
  cleanupAlbum: string | null;
  cleanupSettings: CleanupSettings;
  isPremium: boolean;
  setTab: (tab: Tab) => void;
  setCleanupCategory: (cat: CleanupCategory | null) => void;
  setCleanupAlbum: (album: string | null) => void;
  setCleanupSettings: (s: CleanupSettings) => void;
  addToDeleteBin: (asset: MediaAsset) => void;
  removeFromDeleteBin: (assetId: string) => void;
  removeManyFromDeleteBin: (assetIds: string[]) => void;
  clearDeleteBin: () => void;
  addSessionToHistory: (session: SessionRecord) => void;
  showDeletionSuccess: (stats: DeletionStats) => void;
  clearDeletionStats: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [deleteBin, setDeleteBin] = useState<MediaAsset[]>([]);
  const [history, setHistory] = useState<SessionRecord[]>(mockHistory);
  const [deletionStats, setDeletionStats] = useState<DeletionStats | null>(null);
  const [cleanupCategory, setCleanupCategoryState] = useState<CleanupCategory | null>(null);
  const [cleanupAlbum, setCleanupAlbumState] = useState<string | null>(null);
  const [cleanupSettings, setCleanupSettingsState] = useState<CleanupSettings>(DEFAULT_CLEANUP_SETTINGS);
  const isPremium = false;

  const setTab = useCallback((tab: Tab) => setActiveTab(tab), []);
  const setCleanupCategory = useCallback((cat: CleanupCategory | null) => setCleanupCategoryState(cat), []);
  const setCleanupAlbum = useCallback((album: string | null) => setCleanupAlbumState(album), []);
  const setCleanupSettings = useCallback((s: CleanupSettings) => setCleanupSettingsState(s), []);

  const addToDeleteBin = useCallback((asset: MediaAsset) => {
    setDeleteBin((prev) =>
      prev.some((a) => a.id === asset.id) ? prev : [...prev, asset]
    );
  }, []);

  const removeFromDeleteBin = useCallback((assetId: string) => {
    setDeleteBin((prev) => prev.filter((a) => a.id !== assetId));
  }, []);

  const removeManyFromDeleteBin = useCallback((assetIds: string[]) => {
    const idSet = new Set(assetIds);
    setDeleteBin((prev) => prev.filter((a) => !idSet.has(a.id)));
  }, []);

  const clearDeleteBin = useCallback(() => setDeleteBin([]), []);

  const addSessionToHistory = useCallback((session: SessionRecord) => {
    setHistory((prev) => [session, ...prev]);
  }, []);

  const showDeletionSuccess = useCallback((stats: DeletionStats) => {
    setDeletionStats(stats);
  }, []);

  const clearDeletionStats = useCallback(() => setDeletionStats(null), []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        deleteBin,
        history,
        deletionStats,
        cleanupCategory,
        cleanupAlbum,
        cleanupSettings,
        isPremium,
        setTab,
        setCleanupCategory,
        setCleanupAlbum,
        setCleanupSettings,
        addToDeleteBin,
        removeFromDeleteBin,
        removeManyFromDeleteBin,
        clearDeleteBin,
        addSessionToHistory,
        showDeletionSuccess,
        clearDeletionStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
