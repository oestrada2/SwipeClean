'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CleanupSettingsModal } from '../../components/CleanupSettingsModal';
import { DeleteBinView } from '../../components/DeleteBinView';
import { HistoryView } from '../../components/HistoryView';
import { HomeDashboard } from '../../components/HomeDashboard';
import { OnboardingFlow } from '../../components/OnboardingFlow';
import { SwipeView } from '../../components/SwipeView';
import { AppProvider, useApp, useTheme } from '../../lib/context';
import type { Tab } from '../../lib/types';

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

const TABS: Array<{ id: Tab; label: string; icon: ReactNode }> = [
  { id: 'home', label: 'Home', icon: <IconHome /> },
  { id: 'bin', label: 'Bin', icon: <IconTrash /> },
  { id: 'history', label: 'History', icon: <IconClock /> },
];

function AppShell() {
  const theme = useTheme();
  const { activeTab, setTab, deleteBin, cleanupSettings, setCleanupSettings } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('swipeclean_onboarded')) {
      setShowOnboarding(true);
    }
  }, []);

  function handleOnboardingComplete() {
    localStorage.setItem('swipeclean_onboarded', '1');
    setShowOnboarding(false);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'swipe' && <SwipeView />}
        {activeTab === 'bin' && <DeleteBinView />}
        {activeTab === 'history' && <HistoryView />}
      </div>

      {/* Bottom tab bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          background: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 100,
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const binBadge = tab.id === 'bin' && deleteBin.length > 0;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 4px',
                borderRadius: theme.radius.md,
                color: active ? theme.colors.primary : theme.colors.muted,
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              {tab.icon}
              <span style={{ fontSize: 11, fontWeight: 600 }}>{tab.label}</span>
              {binBadge && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: '20%',
                    background: theme.colors.delete,
                    color: '#fff',
                    borderRadius: '50%',
                    width: 17,
                    height: 17,
                    fontSize: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {deleteBin.length > 99 ? '99+' : deleteBin.length}
                </span>
              )}
            </button>
          );
        })}

        {/* Settings tab */}
        <button
          onClick={() => setShowSettings(true)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 4px',
            borderRadius: theme.radius.md,
            color: showSettings ? theme.colors.primary : theme.colors.muted,
            fontFamily: 'inherit',
          }}
        >
          <IconSettings />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Settings</span>
        </button>
      </nav>

      {showSettings && (
        <CleanupSettingsModal
          settings={cleanupSettings}
          onApply={setCleanupSettings}
          onClose={() => setShowSettings(false)}
          onShowPaywall={() => setShowSettings(false)}
        />
      )}

      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}

export default function CleanPage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
