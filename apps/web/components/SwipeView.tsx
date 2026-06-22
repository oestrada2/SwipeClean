'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BehindCard, SwipeCard } from './SwipeCard';
import { useApp } from '../lib/context';
import { formatBytes } from '../lib/formatBytes';
import { filterMedia } from '../lib/mockData';
import { theme } from '../lib/theme';
import type { MediaAsset } from '../lib/types';

type LastAction = { asset: MediaAsset; decision: 'keep' | 'delete' };

export function SwipeView() {
  const { addToDeleteBin, removeFromDeleteBin, addSessionToHistory, setTab, cleanupCategory, cleanupAlbum, cleanupSettings } =
    useApp();

  const queue = useMemo(
    () => filterMedia(cleanupCategory, cleanupAlbum, cleanupSettings),
    [cleanupCategory, cleanupAlbum, cleanupSettings]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [keptCount, setKeptCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [infoAsset, setInfoAsset] = useState<MediaAsset | null>(null);

  const currentAsset = queue[currentIndex];
  const nextAsset = queue[currentIndex + 1];
  const isComplete = currentIndex >= queue.length;

  const handleSwipeLeft = useCallback(() => {
    if (!currentAsset) return;
    addToDeleteBin(currentAsset);
    setLastAction({ asset: currentAsset, decision: 'delete' });
    setDeletedCount((n) => n + 1);
    setCurrentIndex((i) => i + 1);
  }, [currentAsset, addToDeleteBin]);

  const handleSwipeRight = useCallback(() => {
    if (!currentAsset) return;
    setLastAction({ asset: currentAsset, decision: 'keep' });
    setKeptCount((n) => n + 1);
    setCurrentIndex((i) => i + 1);
  }, [currentAsset]);

  const handleUndo = useCallback(() => {
    if (!lastAction) return;
    if (lastAction.decision === 'delete') {
      removeFromDeleteBin(lastAction.asset.id);
      setDeletedCount((n) => Math.max(0, n - 1));
    } else {
      setKeptCount((n) => Math.max(0, n - 1));
    }
    setCurrentIndex((i) => i - 1);
    setLastAction(null);
  }, [lastAction, removeFromDeleteBin]);

  useEffect(() => {
    if (isComplete) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') handleSwipeLeft();
      else if (e.key === 'ArrowRight') handleSwipeRight();
      else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isComplete, handleSwipeLeft, handleSwipeRight, handleUndo]);

  function handleFinish() {
    addSessionToHistory({
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      keptCount,
      deletedCount,
      bytesFreed: 0,
    });
    setTab('bin');
  }

  const progress = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

  if (queue.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 72px)',
          padding: 32,
          textAlign: 'center',
          background: theme.colors.background,
        }}
      >
        <span style={{ fontSize: 64, marginBottom: 20 }}>🔍</span>
        <h2 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 800, color: theme.colors.text }}>
          Nothing here
        </h2>
        <p style={{ margin: '0 0 28px', color: theme.colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          No items found for this category.
        </p>
        <button
          onClick={() => setTab('home')}
          style={{
            background: theme.colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius.md,
            padding: '14px 28px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ← Pick another category
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 72px)',
          padding: 32,
          textAlign: 'center',
          background: theme.colors.background,
        }}
      >
        <span style={{ fontSize: 72, marginBottom: 24 }}>✅</span>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 32,
            fontWeight: 800,
            color: theme.colors.text,
          }}
        >
          Session Done!
        </h2>
        <p
          style={{
            margin: '0 0 32px',
            color: theme.colors.muted,
            fontSize: 16,
            lineHeight: 1.65,
          }}
        >
          Reviewed {queue.length} items.
          <br />
          {deletedCount} item{deletedCount !== 1 ? 's' : ''} waiting in Delete Bin.
        </p>
        <button
          onClick={handleFinish}
          style={{
            background: theme.colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius.md,
            padding: '15px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Review Delete Bin →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 0', minHeight: 'calc(100vh - 72px)', background: theme.colors.background }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: theme.colors.muted,
            fontSize: 14,
            fontWeight: 600,
            minWidth: 60,
          }}
        >
          {currentIndex + 1} / {queue.length}
        </span>
        <span
          style={{
            color: theme.colors.text,
            fontSize: 15,
            fontWeight: 700,
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {cleanupCategory === 'albums' && cleanupAlbum
            ? cleanupAlbum
            : cleanupCategory
            ? cleanupCategory.replace(/-/g, ' ')
            : 'Swipe to Review'}
        </span>
        <button
          onClick={handleUndo}
          disabled={!lastAction}
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: lastAction ? 'pointer' : 'default',
            opacity: lastAction ? 1 : 0.35,
            color: theme.colors.text,
            fontFamily: 'inherit',
          }}
        >
          ↩ Undo
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 3,
          background: theme.colors.border,
          borderRadius: 99,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: theme.colors.primary,
            borderRadius: 99,
            transition: 'width 200ms ease',
          }}
        />
      </div>

      {/* Card stack */}
      <div style={{ position: 'relative' }}>
        {nextAsset && (
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 0,
              right: 0,
              opacity: 0.72,
              transform: 'scale(0.94)',
              transformOrigin: 'top center',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <BehindCard asset={nextAsset} />
          </div>
        )}
        {currentAsset && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <SwipeCard
              key={currentAsset.id}
              asset={currentAsset}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onInfo={() => setInfoAsset(currentAsset)}
            />
          </div>
        )}
      </div>

      {/* Hint row */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <div
          style={{
            flex: 1,
            padding: 10,
            background: theme.colors.deleteLight,
            borderRadius: theme.radius.md,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              color: theme.colors.delete,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            ← DELETE
          </span>
        </div>
        <div
          style={{
            flex: 1,
            padding: 10,
            background: theme.colors.keepLight,
            borderRadius: theme.radius.md,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              color: theme.colors.keep,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            KEEP →
          </span>
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          color: theme.colors.muted,
          fontSize: 12,
          marginTop: 8,
          marginBottom: 0,
        }}
      >
        Drag card or use ← → arrow keys · Ctrl+Z to undo
      </p>

      {/* Info modal */}
      {infoAsset && (
        <InfoModal asset={infoAsset} onClose={() => setInfoAsset(null)} />
      )}
    </div>
  );
}

function InfoModal({
  asset,
  onClose,
}: {
  asset: MediaAsset;
  onClose: () => void;
}) {
  const rows: [string, string][] = [
    ['Filename', asset.filename ?? asset.id],
    ['Type', asset.kind === 'photo' ? 'Photo' : 'Video'],
    ['Size', formatBytes(asset.sizeBytes)],
    ['Album', asset.album ?? 'Camera'],
    ...(asset.width && asset.height
      ? ([['Resolution', `${asset.width} × ${asset.height}`]] as [string, string][])
      : []),
    ...(asset.durationSeconds
      ? ([['Duration', `${asset.durationSeconds}s`]] as [string, string][])
      : []),
    [
      'Date',
      new Date(asset.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ],
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
        zIndex: 1000,
        paddingBottom: 72,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: `${theme.radius.xl}px ${theme.radius.xl}px 0 0`,
          padding: 24,
          width: '100%',
          maxWidth: 480,
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: theme.colors.border,
            borderRadius: 99,
            margin: '0 auto 16px',
          }}
        />
        <h3
          style={{
            margin: '0 0 16px',
            fontSize: 20,
            fontWeight: 800,
            color: theme.colors.text,
          }}
        >
          File Details
        </h3>
        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '12px 0',
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <span
              style={{
                color: theme.colors.muted,
                fontSize: 14,
                width: 100,
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span
              style={{ color: theme.colors.text, fontSize: 14, fontWeight: 500 }}
            >
              {value}
            </span>
          </div>
        ))}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 16,
            padding: 14,
            background: theme.colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius.md,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
