'use client';
import { useState } from 'react';
import { CleanupSettingsModal } from './CleanupSettingsModal';
import { useApp, useTheme } from '../lib/context';
import { getMockAlbums } from '../lib/mockData';
import type { CleanupCategory } from '../lib/types';

type CategoryDef = {
  id: CleanupCategory;
  label: string;
  sub?: string;
  gradient: string;
  icon?: string;
  isPremiumOnly?: boolean;
  height?: number;
};

function getMonthLabel(offset: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - offset);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = String(d.getFullYear()).slice(2);
  return `${month} '${year}`;
}

export function HomeDashboard() {
  const theme = useTheme();
  const { setTab, setCleanupCategory, setCleanupAlbum, cleanupSettings, setCleanupSettings, isPremium } = useApp();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAlbumPicker, setShowAlbumPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'photos-only' | 'videos-only' | null>(null);

  const categories: CategoryDef[] = [
    {
      id: 'all-photos',
      label: 'all photos',
      sub: 'Your full library',
      gradient: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
      icon: '🖼',
      height: 140,
    },
    {
      id: 'on-this-day',
      label: 'on this day',
      sub: 'Photos & videos from this date in past years',
      gradient: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
      icon: '📅',
      height: 140,
    },
    {
      id: 'recents',
      label: 'recents',
      sub: 'Last 30 days',
      gradient: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
      icon: '🕐',
    },
    {
      id: 'screenshots',
      label: 'screenshots',
      gradient: 'linear-gradient(90deg, #06B6D4 0%, #22D3EE 100%)',
      icon: '📸',
    },
    {
      id: 'large-videos',
      label: 'large videos',
      gradient: 'linear-gradient(90deg, #6366F1 0%, #818CF8 100%)',
      icon: '🎬',
      isPremiumOnly: true,
    },
    {
      id: 'albums',
      label: 'albums',
      sub: 'Browse by folder',
      gradient: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
      icon: '📁',
    },
    {
      id: 'smart-cleanup',
      label: 'smart cleanup',
      sub: 'Duplicates · Blurry Shots · AI Picks',
      gradient: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
      icon: '✨',
      isPremiumOnly: true,
      height: 140,
    },
    {
      id: 'month-0',
      label: getMonthLabel(0),
      gradient: 'linear-gradient(90deg, #14B8A6 0%, #2DD4BF 100%)',
    },
    {
      id: 'month-1',
      label: getMonthLabel(1),
      gradient: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
    },
    {
      id: 'month-2',
      label: getMonthLabel(2),
      gradient: 'linear-gradient(90deg, #EC4899 0%, #F472B6 100%)',
    },
    {
      id: 'month-3',
      label: getMonthLabel(3),
      gradient: 'linear-gradient(90deg, #84CC16 0%, #A3E635 100%)',
    },
  ];

  const monthIds = new Set(['month-0', 'month-1', 'month-2', 'month-3']);

  function handleTap(cat: CategoryDef) {
    if (cat.isPremiumOnly && !isPremium) {
      setShowPaywall(true);
      return;
    }
    if (cat.id === 'albums') {
      setShowAlbumPicker(true);
      return;
    }
    setCleanupAlbum(null);
    setCleanupCategory(cat.id);
    setTab('swipe');
  }

  function handleAlbumSelect(albumName: string) {
    setCleanupAlbum(albumName);
    setCleanupCategory('albums');
    setShowAlbumPicker(false);
    setTab('swipe');
  }

  return (
    <div style={{ background: theme.colors.background, minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '56px 20px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/app-icon.png"
            alt=""
            style={{ width: 36, height: 36, objectFit: 'contain' }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 900,
              color: theme.colors.text,
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            SwipeClean
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { icon: '⚙', label: 'Settings', onTap: () => setShowSettings(true) },
            { icon: '☁', label: 'Storage', onTap: undefined },
            { icon: '⋯', label: 'More', onTap: undefined },
          ].map(({ icon, label, onTap }) => (
            <button
              key={label}
              aria-label={label}
              onClick={onTap}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: theme.colors.surfaceOverlay,
                border: `1px solid ${theme.colors.divider}`,
                color: theme.colors.textSecondary,
                fontSize: 17,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <p
        style={{
          margin: '0 20px 16px',
          color: theme.colors.muted,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0.2,
        }}
      >
        What do you want to clean?
      </p>

      {/* Quick stats 2×2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 20px 16px' }}>
        {([
          { value: '4,382', label: 'Photos & Videos' },
          { value: '12.4 GB', label: 'Library Size' },
          { value: '342', label: 'To Review' },
          { value: '1.2 GB', label: 'Can Free Up' },
        ] as const).map(({ value, label }) => (
          <div
            key={label}
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 14,
              padding: '14px 12px',
            }}
          >
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: theme.colors.text, lineHeight: 1.1 }}>{value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: theme.colors.muted }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Media type quick filters — compact row, top-right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 14px 14px', gap: 6 }}>
        {([
          { id: 'photos-only' as const, icon: '📷', label: 'photos' },
          { id: 'videos-only' as const, icon: '🎥', label: 'videos' },
        ]).map(({ id, icon, label }) => {
          const checked = selectedMediaType === id;
          return (
            <button
              key={id}
              onClick={() => {
                const next = selectedMediaType === id ? null : id;
                setSelectedMediaType(next);
                if (next) { setCleanupAlbum(null); setCleanupCategory(next); setTab('swipe'); }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: checked ? theme.colors.primaryLight : theme.colors.inputBackground,
                border: `1px solid ${checked ? theme.colors.primary : theme.colors.border}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  border: `1.5px solid ${checked ? theme.colors.primary : theme.colors.chevron}`,
                  background: checked ? theme.colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {checked && (
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                    <path d="M1 3L3 5.5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 12 }}>{icon}</span>
              <span style={{ color: checked ? theme.colors.text : theme.colors.textSecondary, fontSize: 12, fontWeight: 600 }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category cards */}
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map((cat) => {
          const isMonth = monthIds.has(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleTap(cat)}
              style={{
                position: 'relative',
                width: '100%',
                minHeight: cat.height ?? 112,
                background: cat.gradient,
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                padding: '18px 22px',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              {cat.icon && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 78,
                    opacity: 0.15,
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {cat.icon}
                </span>
              )}
              <div
                style={{
                  position: 'absolute',
                  top: 15,
                  right: 16,
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                {cat.isPremiumOnly && (
                  <span
                    style={{
                      background: '#F59E0B',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: 1.5,
                      padding: '3px 9px',
                      borderRadius: 6,
                      lineHeight: 1.6,
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
              <span
                style={{
                  color: '#fff',
                  fontSize: 40,
                  fontWeight: 900,
                  letterSpacing: isMonth ? -2 : -1,
                  lineHeight: 1.05,
                  display: 'block',
                  textShadow: '0 2px 12px rgba(0,0,0,0.25)',
                  textTransform: isMonth ? 'none' : 'none',
                }}
              >
                {cat.label}
              </span>
              {cat.sub && (
                <span
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 13,
                    marginTop: 5,
                    display: 'block',
                    fontWeight: 500,
                  }}
                >
                  {cat.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showPaywall && <PremiumModal onClose={() => setShowPaywall(false)} />}
      {showSettings && (
        <CleanupSettingsModal
          settings={cleanupSettings}
          onApply={setCleanupSettings}
          onClose={() => setShowSettings(false)}
          onShowPaywall={() => setShowPaywall(true)}
        />
      )}
      {showAlbumPicker && (
        <AlbumPickerModal
          onSelect={handleAlbumSelect}
          onClose={() => setShowAlbumPicker(false)}
        />
      )}
    </div>
  );
}

function AlbumPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (album: string) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const albums = getMockAlbums();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        paddingBottom: 72,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: 480,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + title */}
        <div style={{ padding: '20px 24px 16px', flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 4,
              background: theme.colors.chevron,
              borderRadius: 99,
              margin: '0 auto 20px',
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 900,
              color: theme.colors.text,
              letterSpacing: -0.5,
            }}
          >
            choose an album
          </h3>
          <p style={{ margin: '4px 0 0', color: theme.colors.muted, fontSize: 13 }}>
            {albums.reduce((s, a) => s + a.count, 0)} items across {albums.length} albums
          </p>
        </div>

        {/* Album list */}
        <div style={{ overflowY: 'auto', padding: '0 16px 24px' }}>
          {albums.map((album) => (
            <button
              key={album.name}
              onClick={() => onSelect(album.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '14px 16px',
                background: theme.colors.inputBackground,
                border: `1px solid ${theme.colors.divider}`,
                borderRadius: 14,
                marginBottom: 8,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 30 }}>
                  {album.name === 'Camera'
                    ? '📷'
                    : album.name === 'Screenshots'
                    ? '📸'
                    : album.name === 'WhatsApp'
                    ? '💬'
                    : '📁'}
                </span>
                <span style={{ fontSize: 17, fontWeight: 700, color: theme.colors.text }}>
                  {album.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.colors.muted,
                  background: theme.colors.inputBackground,
                  padding: '4px 10px',
                  borderRadius: 99,
                }}
              >
                {album.count} items
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PremiumModal({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  const pricing = {
    monthly: { price: '$4.99', period: '/month', note: 'Billed monthly' },
    annual: { price: '$2.99', period: '/month', note: 'Billed $35.99/year · Save 40%' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        paddingBottom: 72,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: '24px 24px 0 0',
          padding: '28px 24px 32px',
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
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
        <span style={{ fontSize: 48 }}>✨</span>
        <h3 style={{ margin: '10px 0 6px', fontSize: 24, fontWeight: 900, color: theme.colors.text }}>
          SwipeClean Pro
        </h3>
        <p style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 1.55, margin: '0 0 22px' }}>
          Smart Cleanup, Large Videos, duplicate detection, blurry photo finder, and AI suggestions.
        </p>

        {/* Plan toggle */}
        <div
          style={{
            display: 'flex',
            background: theme.colors.inputBackground,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: 4,
            marginBottom: 16,
          }}
        >
          {(['monthly', 'annual'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: plan === p ? theme.colors.primary : 'transparent',
                border: 'none',
                borderRadius: 11,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 700,
                color: plan === p ? '#fff' : theme.colors.muted,
                transition: 'background 0.18s ease, color 0.18s ease',
                position: 'relative',
              }}
            >
              {p === 'annual' ? 'Annual' : 'Monthly'}
              {p === 'annual' && (
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: 10,
                    background: '#F59E0B',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: 0.8,
                    padding: '2px 6px',
                    borderRadius: 99,
                  }}
                >
                  SAVE 40%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Price display */}
        <div style={{ marginBottom: 22 }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: theme.colors.text }}>
            {pricing[plan].price}
          </span>
          <span style={{ fontSize: 16, color: theme.colors.muted, fontWeight: 500 }}>
            {pricing[plan].period}
          </span>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: theme.colors.muted }}>
            {pricing[plan].note}
          </p>
        </div>

        <button
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none',
            borderRadius: 99,
            fontSize: 17,
            fontWeight: 900,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 10,
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
          }}
          onClick={onClose}
        >
          Start Free Trial
        </button>
        <button
          style={{
            width: '100%',
            padding: '12px',
            background: 'none',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            color: theme.colors.muted,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
          onClick={onClose}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
