'use client';
import { useRef } from 'react';
import { theme } from '../lib/theme';
import type { MediaAsset } from '../lib/types';

type Props = {
  asset: MediaAsset;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInfo: () => void;
};

export function SwipeCard({ asset, onSwipeLeft, onSwipeRight, onInfo }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const keepRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);
  const infoBtnRef = useRef<HTMLButtonElement>(null);
  const startX = useRef(0);
  const dragX = useRef(0);
  const isDragging = useRef(false);

  const THRESHOLD = 100;

  function applyTransform(x: number, transition = '') {
    const el = cardRef.current;
    if (!el) return;
    const rotation = Math.min(Math.max(x / 15, -22), 22);
    el.style.transition = transition;
    el.style.transform = `translateX(${x}px) rotate(${rotation}deg)`;

    if (keepRef.current) {
      keepRef.current.style.opacity = String(
        Math.min(Math.max((x - 20) / 80, 0), 1)
      );
    }
    if (deleteRef.current) {
      deleteRef.current.style.opacity = String(
        Math.min(Math.max((-x - 20) / 80, 0), 1)
      );
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (infoBtnRef.current?.contains(e.target as Node)) return;
    isDragging.current = true;
    startX.current = e.clientX;
    dragX.current = 0;
    cardRef.current?.setPointerCapture(e.pointerId);
    if (cardRef.current) cardRef.current.style.transition = '';
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    dragX.current = delta;
    applyTransform(delta);
  }

  function handlePointerUp() {
    if (!isDragging.current) return;
    isDragging.current = false;
    const x = dragX.current;

    if (x > THRESHOLD) {
      applyTransform(1400, 'transform 230ms ease-out');
      setTimeout(onSwipeRight, 230);
    } else if (x < -THRESHOLD) {
      applyTransform(-1400, 'transform 230ms ease-out');
      setTimeout(onSwipeLeft, 230);
    } else {
      applyTransform(0, 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)');
    }
  }

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() =>
        applyTransform(0, 'transform 300ms ease')
      }
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        boxShadow: '0 8px 32px rgba(15,23,42,0.14)',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        willChange: 'transform',
      }}
    >
      <img
        src={asset.thumbnailUri}
        alt={asset.filename ?? asset.id}
        draggable={false}
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* KEEP badge */}
      <div
        ref={keepRef}
        style={{
          position: 'absolute',
          top: 24,
          right: 20,
          border: `3px solid ${theme.colors.keep}`,
          borderRadius: theme.radius.sm,
          padding: '6px 12px',
          transform: 'rotate(18deg)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            color: theme.colors.keep,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          KEEP
        </span>
      </div>

      {/* DELETE badge */}
      <div
        ref={deleteRef}
        style={{
          position: 'absolute',
          top: 24,
          left: 20,
          border: `3px solid ${theme.colors.delete}`,
          borderRadius: theme.radius.sm,
          padding: '6px 12px',
          transform: 'rotate(-18deg)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            color: theme.colors.delete,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          DELETE
        </span>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
          <p
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {asset.filename ?? asset.id}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 13,
              margin: '2px 0 0',
            }}
          >
            {asset.album ?? 'Camera'}
          </p>
        </div>
        <button
          ref={infoBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            onInfo();
          }}
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          ⓘ
        </button>
      </div>
    </div>
  );
}

export function BehindCard({ asset }: { asset: MediaAsset }) {
  return (
    <div
      style={{
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
      }}
    >
      <img
        src={asset.thumbnailUri}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
