'use client';
import { useState } from 'react';
import { CleanupSettingsModal } from './CleanupSettingsModal';
import { useApp } from '../lib/context';
import { getMockAlbums } from '../lib/mockData';
import { theme } from '../lib/theme';
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
    <div style={{ background: '#111827', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '56px 20px 20px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: -0.5,
            lineHeight: 1,
          }}
        >
          SwipeClean
        </h1>
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
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
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
          margin: '0 20px 20px',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0.2,
        }}
      >
        What do you want to clean?
      </p>

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
                background: checked ? 'rgba(109,40,217,0.25)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${checked ? '#6D28D9' : 'rgba(255,255,255,0.1)'}`,
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
                  border: `1.5px solid ${checked ? '#6D28D9' : 'rgba(255,255,255,0.3)'}`,
                  background: checked ? '#6D28D9' : 'transparent',
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
              <span style={{ color: checked ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>
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
  const albums = getMockAlbums();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
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
          background: '#1F2937',
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
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 99,
              margin: '0 auto 20px',
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: -0.5,
            }}
          >
            choose an album
          </h3>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
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
                <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>
                  {album.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.45)',
                  background: 'rgba(255,255,255,0.08)',
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
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
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
          background: '#1F2937',
          borderRadius: '24px 24px 0 0',
          padding: '32px 24px 36px',
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
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 99,
            margin: '0 auto 24px',
          }}
        />
        <span style={{ fontSize: 52 }}>✨</span>
        <h3 style={{ margin: '12px 0 8px', fontSize: 26, fontWeight: 900, color: '#fff' }}>
          SwipeClean Pro
        </h3>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 15,
            lineHeight: 1.55,
            margin: '0 0 28px',
          }}
        >
          Smart Cleanup, Large Videos, duplicate detection, blurry photo finder, and AI
          suggestions are Pro features.
        </p>
        <button
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none',
            borderRadius: theme.radius.md,
            fontSize: 17,
            fontWeight: 900,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 10,
          }}
          onClick={onClose}
        >
          Upgrade to Pro
        </button>
        <button
          style={{
            width: '100%',
            padding: '14px',
            background: 'none',
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
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
