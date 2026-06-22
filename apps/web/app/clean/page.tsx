'use client';
import { useState } from 'react';
import { CleanupSettingsModal } from '../../components/CleanupSettingsModal';
import { DeleteBinView } from '../../components/DeleteBinView';
import { HistoryView } from '../../components/HistoryView';
import { HomeDashboard } from '../../components/HomeDashboard';
import { SwipeView } from '../../components/SwipeView';
import { AppProvider, useApp } from '../../lib/context';
import { theme } from '../../lib/theme';
import type { Tab } from '../../lib/types';

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'bin', label: 'Bin', icon: '🗑' },
  { id: 'history', label: 'History', icon: '📋' },
];

function AppShell() {
  const { activeTab, setTab, deleteBin, cleanupSettings, setCleanupSettings } = useApp();
  const [showSettings, setShowSettings] = useState(false);

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
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
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
          <span style={{ fontSize: 22 }}>⚙️</span>
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
