'use client';
import { useState } from 'react';
import { useTheme } from '../lib/context';
import { getMockAlbums } from '../lib/mockData';
import { DEFAULT_CLEANUP_SETTINGS } from '../lib/types';
import type {
  AppearanceMode,
  CleanupSettings,
  MediaTypeFilter,
  NotificationSettings,
  SortOrder,
} from '../lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <p
      style={{
        margin: '20px 0 4px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.2,
        color: theme.colors.sectionLabel,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  const theme = useTheme();
  return <div style={{ height: 1, background: theme.colors.divider, margin: '6px 0 0' }} />;
}

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const theme = useTheme();
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '10px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${selected ? theme.colors.primary : theme.colors.chevron}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected && (
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.primary }}
          />
        )}
      </span>
      <span
        style={{
          color: selected ? theme.colors.text : theme.colors.textSecondary,
          fontSize: 15,
          fontWeight: selected ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function ToggleRow({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        gap: 12,
      }}
    >
      <div>
        <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: 15, fontWeight: 500 }}>
          {label}
        </p>
        {sub && (
          <p style={{ margin: '2px 0 0', color: theme.colors.textTertiary, fontSize: 12 }}>{sub}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 48,
          height: 28,
          borderRadius: 99,
          background: value ? theme.colors.primary : theme.colors.toggleOff,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
          padding: 0,
          transition: 'background 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 23 : 3,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        />
      </button>
    </div>
  );
}

function NavRow({
  label,
  sub,
  onPress,
  accent,
}: {
  label: string;
  sub?: string;
  onPress: () => void;
  accent?: string;
}) {
  const theme = useTheme();
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: accent ?? theme.colors.textSecondary,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        {sub && (
          <p style={{ margin: '2px 0 0', color: theme.colors.textTertiary, fontSize: 12 }}>{sub}</p>
        )}
      </div>
      <span style={{ color: theme.colors.chevron, fontSize: 22, lineHeight: 1 }}>›</span>
    </button>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        background: theme.colors.inputBackground,
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            flex: 1,
            padding: '8px 4px',
            background: value === opt.id ? theme.colors.surfaceOverlay : 'transparent',
            border: value === opt.id
              ? `1px solid ${theme.colors.inputBorder}`
              : '1px solid transparent',
            borderRadius: 8,
            cursor: 'pointer',
            color: value === opt.id ? theme.colors.text : theme.colors.muted,
            fontSize: 13,
            fontWeight: value === opt.id ? 700 : 400,
            fontFamily: 'inherit',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Sub-modals ────────────────────────────────────────────────────────────────

function ProtectedAlbumsModal({
  protectedAlbums,
  onChange,
  onClose,
}: {
  protectedAlbums: string[];
  onChange: (albums: string[]) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const albums = getMockAlbums();
  const [selected, setSelected] = useState(new Set(protectedAlbums));

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 400,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: 480,
          padding: '20px 20px 40px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: theme.colors.chevron,
            borderRadius: 99,
            margin: '0 auto 20px',
          }}
        />
        <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, color: theme.colors.text }}>
          Protected Albums
        </h3>
        <p style={{ margin: '0 0 20px', color: theme.colors.muted, fontSize: 13 }}>
          Checked albums are excluded from normal swiping
        </p>
        {albums.map((album) => {
          const isProtected = selected.has(album.name);
          const icon =
            album.name === 'Camera'
              ? '📷'
              : album.name === 'Screenshots'
              ? '📸'
              : album.name === 'WhatsApp'
              ? '💬'
              : '📁';
          return (
            <button
              key={album.name}
              onClick={() => toggle(album.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '13px 0',
                background: 'none',
                border: 'none',
                borderBottom: `1px solid ${theme.colors.divider}`,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <p style={{ margin: 0, color: theme.colors.text, fontSize: 15, fontWeight: 500 }}>
                    {album.name}
                  </p>
                  <p style={{ margin: '2px 0 0', color: theme.colors.textTertiary, fontSize: 12 }}>
                    {album.count} items
                  </p>
                </div>
              </div>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${isProtected ? '#EF4444' : theme.colors.chevron}`,
                  background: isProtected ? '#EF4444' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                {isProtected && (
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, lineHeight: 1 }}>
                    ✕
                  </span>
                )}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => { onChange(Array.from(selected)); onClose(); }}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '14px',
            background: theme.colors.primary,
            border: 'none',
            borderRadius: theme.radius.md,
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function NotificationsModal({
  notifications,
  onChange,
  onClose,
}: {
  notifications: NotificationSettings;
  onChange: (n: NotificationSettings) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const [draft, setDraft] = useState<NotificationSettings>({ ...notifications });

  const rows: { key: keyof NotificationSettings; label: string; sub: string }[] = [
    { key: 'weeklyReminders', label: 'Weekly Cleanup Reminders', sub: 'Reminded every week to clean up' },
    { key: 'monthlyReminders', label: 'Monthly Cleanup Reminders', sub: 'Reminded every month to clean up' },
    { key: 'screenshotReminders', label: 'Screenshot Cleanup', sub: 'When screenshots folder gets large' },
    { key: 'largeVideoReminders', label: 'Large Video Alerts', sub: 'When large videos are detected' },
    { key: 'smartCleanupSuggestions', label: 'Smart Cleanup Suggestions', sub: 'AI-powered cleanup tips' },
    { key: 'maxTwoPerWeek', label: 'Max 2–3 per week', sub: 'Limit total notifications per week' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 400,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: 480,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 4,
              background: theme.colors.chevron,
              borderRadius: 99,
              margin: '0 auto 20px',
            }}
          />
          <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, color: theme.colors.text }}>
            Notification Preferences
          </h3>
          <p style={{ margin: '0 0 16px', color: theme.colors.muted, fontSize: 13 }}>
            Control when SwipeClean can notify you
          </p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {rows.map(({ key, label, sub }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 0',
                borderBottom: `1px solid ${theme.colors.divider}`,
                gap: 12,
              }}
            >
              <div>
                <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: 14, fontWeight: 500 }}>
                  {label}
                </p>
                <p style={{ margin: '2px 0 0', color: theme.colors.textTertiary, fontSize: 12 }}>
                  {sub}
                </p>
              </div>
              <button
                onClick={() => setDraft((d) => ({ ...d, [key]: !d[key] }))}
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 99,
                  background: draft[key] ? theme.colors.primary : theme.colors.toggleOff,
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  padding: 0,
                  transition: 'background 0.2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: draft[key] ? 21 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }}
                />
              </button>
            </div>
          ))}
          <div style={{ height: 8 }} />
        </div>
        <div
          style={{
            padding: '12px 20px 36px',
            borderTop: `1px solid ${theme.colors.divider}`,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => { onChange(draft); onClose(); }}
            style={{
              width: '100%',
              padding: '14px',
              background: theme.colors.primary,
              border: 'none',
              borderRadius: theme.radius.md,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function CleanupSettingsModal({
  settings,
  onApply,
  onClose,
  onShowPaywall,
  onResetOnboarding,
}: {
  settings: CleanupSettings;
  onApply: (s: CleanupSettings) => void;
  onClose: () => void;
  onShowPaywall: () => void;
  onResetOnboarding?: () => void;
}) {
  const theme = useTheme();
  const [draft, setDraft] = useState<CleanupSettings>({
    ...settings,
    protectedAlbums: [...settings.protectedAlbums],
    notifications: { ...settings.notifications },
  });
  const [showProtectedAlbums, setShowProtectedAlbums] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  function set<K extends keyof CleanupSettings>(key: K, value: CleanupSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  function handleReset() {
    setDraft({
      ...DEFAULT_CLEANUP_SETTINGS,
      protectedAlbums: [],
      notifications: { ...DEFAULT_CLEANUP_SETTINGS.notifications },
    });
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: theme.colors.overlay,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 300,
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: theme.colors.surface,
            borderRadius: '24px 24px 0 0',
            width: '100%',
            maxWidth: 480,
            height: '88vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div
            style={{
              flexShrink: 0,
              padding: '14px 0 0',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: theme.colors.chevron,
                borderRadius: 99,
              }}
            />
          </div>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px 10px',
              flexShrink: 0,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 900,
                color: theme.colors.text,
                letterSpacing: -0.5,
              }}
            >
              Cleanup Settings
            </h3>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: theme.colors.surfaceOverlay,
                border: 'none',
                color: theme.colors.muted,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
              }}
            >
              ×
            </button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 8px' }}>
            {/* Sort Order */}
            <SectionLabel>Sort Order</SectionLabel>
            {(
              [
                { id: 'newest' as SortOrder, label: 'Newest to Oldest' },
                { id: 'oldest' as SortOrder, label: 'Oldest to Newest' },
                { id: 'largest' as SortOrder, label: 'Largest File Size First' },
              ] as const
            ).map((opt) => (
              <RadioRow
                key={opt.id}
                label={opt.label}
                selected={draft.sortOrder === opt.id}
                onSelect={() => set('sortOrder', opt.id)}
              />
            ))}

            <Divider />

            {/* Media Type */}
            <SectionLabel>Media Type</SectionLabel>
            {(
              [
                { id: 'all' as MediaTypeFilter, label: 'Photos & Videos' },
                { id: 'photos' as MediaTypeFilter, label: 'Photos Only' },
                { id: 'videos' as MediaTypeFilter, label: 'Videos Only' },
                { id: 'screenshots' as MediaTypeFilter, label: 'Screenshots Only' },
              ] as const
            ).map((opt) => (
              <RadioRow
                key={opt.id}
                label={opt.label}
                selected={draft.mediaTypeFilter === opt.id}
                onSelect={() => set('mediaTypeFilter', opt.id)}
              />
            ))}

            <Divider />

            {/* Library */}
            <SectionLabel>Library</SectionLabel>
            <NavRow
              label="Protected Albums"
              sub={
                draft.protectedAlbums.length > 0
                  ? `${draft.protectedAlbums.length} album${draft.protectedAlbums.length > 1 ? 's' : ''} protected`
                  : 'None — all albums visible'
              }
              onPress={() => setShowProtectedAlbums(true)}
            />

            <Divider />

            {/* Notifications */}
            <SectionLabel>Notifications</SectionLabel>
            <NavRow
              label="Notification Preferences"
              sub="Reminders, alerts, and smart suggestions"
              onPress={() => setShowNotifications(true)}
            />

            <Divider />

            {/* Haptics */}
            <SectionLabel>Preferences</SectionLabel>
            <ToggleRow
              label="Haptic Feedback"
              sub="Vibration on swipe left, right, and undo"
              value={draft.hapticFeedback}
              onChange={(v) => set('hapticFeedback', v)}
            />

            <Divider />

            {/* Appearance */}
            <SectionLabel>Appearance</SectionLabel>
            <div style={{ padding: '8px 0 12px' }}>
              <SegmentedControl
                options={
                  [
                    { id: 'system' as AppearanceMode, label: 'System' },
                    { id: 'light' as AppearanceMode, label: 'Light' },
                    { id: 'dark' as AppearanceMode, label: 'Dark' },
                  ] as const
                }
                value={draft.appearance}
                onChange={(v) => set('appearance', v)}
              />
            </div>

            <Divider />

            {/* Account */}
            <SectionLabel>Account</SectionLabel>
            <NavRow label="Account Settings" onPress={() => {}} />
            <NavRow
              label="Manage Premium"
              sub="Unlock Smart Cleanup, Large Videos & more"
              onPress={() => {
                onClose();
                onShowPaywall();
              }}
              accent="#F59E0B"
            />

            <Divider />

            {/* Help */}
            <SectionLabel>Help</SectionLabel>
            <NavRow label="Replay Tutorial" sub="Watch the onboarding again" onPress={() => {}} />

            {/* Dev tools */}
            {onResetOnboarding && (
              <>
                <SectionLabel>Developer</SectionLabel>
                <button
                  onClick={() => {
                    localStorage.removeItem('swipeclean_onboarded');
                    onResetOnboarding();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    marginTop: 4,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px dashed rgba(239,68,68,0.35)',
                    borderRadius: 10,
                    color: '#EF4444',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  🔁 Reset Onboarding
                </button>
              </>
            )}

            <div style={{ height: 16 }} />
          </div>

          {/* Action bar */}
          <div
            style={{
              flexShrink: 0,
              padding: '12px 20px 36px',
              borderTop: `1px solid ${theme.colors.divider}`,
              display: 'flex',
              gap: 8,
            }}
          >
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '13px 0',
                background: theme.colors.surfaceOverlay,
                border: `1px solid ${theme.colors.inputBorder}`,
                borderRadius: theme.radius.md,
                color: theme.colors.muted,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Reset
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '13px 0',
                background: theme.colors.surfaceOverlay,
                border: `1px solid ${theme.colors.inputBorder}`,
                borderRadius: theme.radius.md,
                color: theme.colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              style={{
                flex: 2,
                padding: '13px 0',
                background: theme.colors.primary,
                border: 'none',
                borderRadius: theme.radius.md,
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {showProtectedAlbums && (
        <ProtectedAlbumsModal
          protectedAlbums={draft.protectedAlbums}
          onChange={(albums) => setDraft((d) => ({ ...d, protectedAlbums: albums }))}
          onClose={() => setShowProtectedAlbums(false)}
        />
      )}
      {showNotifications && (
        <NotificationsModal
          notifications={draft.notifications}
          onChange={(notifs) => setDraft((d) => ({ ...d, notifications: notifs }))}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </>
  );
}
