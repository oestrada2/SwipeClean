import React, { createContext, useCallback, useContext, useState } from 'react';

import { mockHistory } from '../services/mockMedia';
import {
  CleanupStats,
  DeletionStats,
  FlowScreen,
  MediaAsset,
  ModalScreen,
  SessionRecord,
  Tab,
} from '../types/media';
import { setHapticsEnabled } from '../utils/haptics';

type AppContextType = {
  flowScreen: FlowScreen;
  activeTab: Tab;
  modal: ModalScreen;
  isGuest: boolean;
  hapticsEnabled: boolean;
  deleteBin: MediaAsset[];
  history: SessionRecord[];
  cleanupStats: CleanupStats | null;
  deletionStats: DeletionStats | null;

  completeAuth: (asGuest?: boolean) => void;
  completeOnboarding: () => void;
  completePermission: () => void;
  setTab: (tab: Tab) => void;
  openModal: (modal: NonNullable<ModalScreen>) => void;
  closeModal: () => void;
  signOut: () => void;
  showCleanupSuccess: (stats: CleanupStats) => void;
  showDeletionSuccess: (stats: DeletionStats) => void;

  addToDeleteBin: (asset: MediaAsset) => void;
  removeFromDeleteBin: (assetId: string) => void;
  removeManyFromDeleteBin: (assetIds: string[]) => void;
  clearDeleteBin: () => void;
  addSessionToHistory: (session: SessionRecord) => void;

  toggleHaptics: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [flowScreen, setFlowScreen] = useState<FlowScreen>('auth');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [modal, setModal] = useState<ModalScreen>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [deleteBin, setDeleteBin] = useState<MediaAsset[]>([]);
  const [history, setHistory] = useState<SessionRecord[]>(mockHistory);
  const [cleanupStats, setCleanupStats] = useState<CleanupStats | null>(null);
  const [deletionStats, setDeletionStats] = useState<DeletionStats | null>(null);

  const completeAuth = useCallback((asGuest = false) => {
    setIsGuest(asGuest);
    setFlowScreen('onboarding');
  }, []);

  const completeOnboarding = useCallback(() => {
    setFlowScreen('permission');
  }, []);

  const completePermission = useCallback(() => {
    setFlowScreen(null);
  }, []);

  const setTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const openModal = useCallback((m: NonNullable<ModalScreen>) => {
    setModal(m);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const signOut = useCallback(() => {
    setFlowScreen('auth');
    setActiveTab('home');
    setModal(null);
    setDeleteBin([]);
    setCleanupStats(null);
    setDeletionStats(null);
  }, []);

  const showCleanupSuccess = useCallback((stats: CleanupStats) => {
    setCleanupStats(stats);
    setModal('cleanup-success');
  }, []);

  const showDeletionSuccess = useCallback((stats: DeletionStats) => {
    setDeletionStats(stats);
    setModal('deletion-success');
  }, []);

  const addToDeleteBin = useCallback((asset: MediaAsset) => {
    setDeleteBin((prev) => {
      if (prev.some((a) => a.id === asset.id)) return prev;
      return [...prev, asset];
    });
  }, []);

  const removeFromDeleteBin = useCallback((assetId: string) => {
    setDeleteBin((prev) => prev.filter((a) => a.id !== assetId));
  }, []);

  const removeManyFromDeleteBin = useCallback((assetIds: string[]) => {
    const idSet = new Set(assetIds);
    setDeleteBin((prev) => prev.filter((a) => !idSet.has(a.id)));
  }, []);

  const clearDeleteBin = useCallback(() => {
    setDeleteBin([]);
  }, []);

  const addSessionToHistory = useCallback((session: SessionRecord) => {
    setHistory((prev) => [session, ...prev]);
  }, []);

  const toggleHaptics = useCallback(() => {
    setHapticsEnabledState((prev) => {
      const next = !prev;
      setHapticsEnabled(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        flowScreen,
        activeTab,
        modal,
        isGuest,
        hapticsEnabled,
        deleteBin,
        history,
        cleanupStats,
        deletionStats,
        completeAuth,
        completeOnboarding,
        completePermission,
        setTab,
        openModal,
        closeModal,
        signOut,
        showCleanupSuccess,
        showDeletionSuccess,
        addToDeleteBin,
        removeFromDeleteBin,
        removeManyFromDeleteBin,
        clearDeleteBin,
        addSessionToHistory,
        toggleHaptics,
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
