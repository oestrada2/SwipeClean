'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp, useTheme } from '../lib/context';
import { formatBytes } from '../lib/formatBytes';
import type { MediaAsset } from '../lib/types';

type FilterKind = 'all' | 'photo' | 'video';
type DeleteTarget = 'selected' | 'all';
type ConfirmStep = 1 | 2;

export function DeleteBinView() {
  const theme = useTheme();
  const {
    deleteBin,
    removeFromDeleteBin,
    removeManyFromDeleteBin,
    clearDeleteBin,
    showDeletionSuccess,
    deletionStats,
    clearDeletionStats,
  } = useApp();

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterKind, setFilterKind] = useState<FilterKind>('all');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmStep, setConfirmStep] = useState<ConfirmStep>(1);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>('selected');

  const filteredBin = useMemo(() => {
    if (filterKind === 'all') return deleteBin;
    return deleteBin.filter((a) => a.kind === filterKind);
  }, [deleteBin, filterKind]);

  const selectedItems = useMemo(
    () => filteredBin.filter((a) => selectedIds.has(a.id)),
    [filteredBin, selectedIds]
  );

  const targetItems: MediaAsset[] =
    deleteTarget === 'selected' ? selectedItems : filteredBin;
  const targetBytes = targetItems.reduce((sum, a) => sum + a.sizeBytes, 0);
  const totalBinBytes = deleteBin.reduce((sum, a) => sum + a.sizeBytes, 0);
  const allSelected =
    filteredBin.length > 0 &&
    filteredBin.every((a) => selectedIds.has(a.id));

  function enterSelectMode() {
    setIsSelectMode(true);
    setSelectedIds(new Set());
  }
  function exitSelectMode() {
    setIsSelectMode(false);
    setSelectedIds(new Set());
  }
  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const toggleSelectAll = useCallback(() => {
    setSelectedIds(
      allSelected ? new Set() : new Set(filteredBin.map((a) => a.id))
    );
  }, [allSelected, filteredBin]);

  function handleRestoreSelected() {
    selectedItems.forEach((a) => removeFromDeleteBin(a.id));
    exitSelectMode();
  }
  function handleRestoreAll() {
    clearDeleteBin();
    exitSelectMode();
  }
  function openDeleteConfirm(target: DeleteTarget) {
    setDeleteTarget(target);
    setConfirmStep(1);
    setShowConfirm(true);
  }
  function handleFinalDelete() {
    const ids = targetItems.map((a) => a.id);
    const bytes = targetBytes;
    const count = targetItems.length;
    removeManyFromDeleteBin(ids);
    setShowConfirm(false);
    exitSelectMode();
    showDeletionSuccess({ deletedCount: count, bytesFreed: bytes });
  }

  // Auto-dismiss success banner after 4s
  useEffect(() => {
    if (!deletionStats) return;
    const t = setTimeout(clearDeletionStats, 4000);
    return () => clearTimeout(t);
  }, [deletionStats, clearDeletionStats]);

  if (deleteBin.length === 0 && !deletionStats) {
    return (
      <div style={{ background: theme.colors.background, minHeight: '100dvh' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 20px 16px',
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.text }}>
            Delete Bin
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 160px)',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 72, marginBottom: 24 }}>🗑️</span>
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: 24,
              fontWeight: 800,
              color: theme.colors.text,
            }}
          >
            Bin is empty
          </h3>
          <p style={{ margin: 0, color: theme.colors.muted, fontSize: 15, lineHeight: 1.6 }}>
            Items you swipe left will appear here for review before deletion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.colors.background, minHeight: '100dvh' }}>
      {/* Success banner */}
      {deletionStats && (
        <div
          style={{
            background: theme.colors.keep,
            color: '#fff',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 700 }}>
            ✓ Deleted {deletionStats.deletedCount} items ·{' '}
            {formatBytes(deletionStats.bytesFreed)} freed
          </span>
          <button
            onClick={clearDeletionStats}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              padding: '0 4px',
              fontFamily: 'inherit',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '20px 20px 12px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.text }}>
            Delete Bin
          </h2>
          {deleteBin.length > 0 && (
            <p style={{ margin: '2px 0 0', fontSize: 14, color: theme.colors.muted }}>
              {deleteBin.length} items · {formatBytes(totalBinBytes)}
            </p>
          )}
        </div>
        <button
          onClick={isSelectMode ? exitSelectMode : enterSelectMode}
          style={{
            background: theme.colors.primaryLight,
            border: 'none',
            borderRadius: theme.radius.sm,
            padding: '7px 14px',
            fontSize: 14,
            fontWeight: 700,
            color: theme.colors.primary,
            cursor: 'pointer',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
        >
          {isSelectMode ? 'Done' : 'Select'}
        </button>
      </div>

      {/* Summary + quick actions (non-select mode) */}
      {!isSelectMode && deleteBin.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '12px 16px',
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.xl,
            padding: 16,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: theme.colors.delete,
              }}
            >
              {formatBytes(totalBinBytes)}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: theme.colors.muted }}>
              ready to free
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleRestoreAll}
              style={{
                background: 'none',
                border: `1.5px solid ${theme.colors.primary}`,
                borderRadius: theme.radius.md,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 700,
                color: theme.colors.primary,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Restore All
            </button>
            <button
              onClick={() => openDeleteConfirm('all')}
              style={{
                background: theme.colors.delete,
                border: 'none',
                borderRadius: theme.radius.md,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Select-all row */}
      {isSelectMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px',
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={toggleSelectAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            <Checkbox checked={allSelected} />
            <span style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text }}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </span>
          </button>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.muted }}>
            {selectedIds.size} selected
          </span>
        </div>
      )}

      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '8px 16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {(['all', 'photo', 'video'] as FilterKind[]).map((kind) => {
          const label =
            kind === 'all' ? 'All' : kind === 'photo' ? 'Photos' : 'Videos';
          const count =
            kind === 'all'
              ? deleteBin.length
              : deleteBin.filter((a) => a.kind === kind).length;
          const active = filterKind === kind;
          return (
            <button
              key={kind}
              onClick={() => setFilterKind(kind)}
              style={{
                background: active ? theme.colors.primary : theme.colors.surface,
                border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
                borderRadius: 99,
                padding: '7px 14px',
                fontSize: 13,
                fontWeight: 600,
                color: active ? '#fff' : theme.colors.muted,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              {label} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Item list */}
      <div style={{ padding: '4px 16px 96px' }}>
        {filteredBin.map((item) => (
          <BinItem
            key={item.id}
            asset={item}
            isSelectMode={isSelectMode}
            isSelected={selectedIds.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            onRestore={() => removeFromDeleteBin(item.id)}
          />
        ))}
      </div>

      {/* Select mode action bar */}
      {isSelectMode && selectedIds.size > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 72,
            left: 0,
            right: 0,
            background: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.border}`,
            display: 'flex',
            gap: 8,
            padding: '12px 16px 16px',
            zIndex: 50,
          }}
        >
          <button
            onClick={handleRestoreSelected}
            style={{
              flex: 1,
              padding: 14,
              background: theme.colors.primaryLight,
              border: 'none',
              borderRadius: theme.radius.md,
              fontSize: 15,
              fontWeight: 700,
              color: theme.colors.primary,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Restore ({selectedIds.size})
          </button>
          <button
            onClick={() => openDeleteConfirm('selected')}
            style={{
              flex: 1,
              padding: 14,
              background: theme.colors.delete,
              border: 'none',
              borderRadius: theme.radius.md,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Delete ({selectedIds.size})
          </button>
        </div>
      )}

      {/* Confirm modal */}
      {showConfirm && (
        <ConfirmModal
          step={confirmStep}
          targetCount={targetItems.length}
          targetBytes={targetBytes}
          onContinue={() => setConfirmStep(2)}
          onFinalDelete={handleFinalDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  const theme = useTheme();
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: `2px solid ${checked ? theme.colors.primary : theme.colors.border}`,
        background: checked ? theme.colors.primary : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && (
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>
      )}
    </div>
  );
}

function BinItem({
  asset,
  isSelectMode,
  isSelected,
  onToggle,
  onRestore,
}: {
  asset: MediaAsset;
  isSelectMode: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onRestore: () => void;
}) {
  const theme = useTheme();
  return (
    <div
      onClick={isSelectMode ? onToggle : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        padding: 10,
        marginBottom: 8,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: isSelectMode ? 'pointer' : 'default',
      }}
    >
      {isSelectMode && (
        <div style={{ marginRight: 8 }}>
          <Checkbox checked={isSelected} />
        </div>
      )}
      <img
        src={asset.thumbnailUri}
        alt=""
        style={{
          width: 80,
          height: 80,
          objectFit: 'cover',
          borderRadius: theme.radius.md,
          flexShrink: 0,
          background: theme.colors.border,
        }}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          margin: '0 8px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: theme.colors.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {asset.filename ?? asset.id}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: theme.colors.muted }}>
          {asset.album ?? 'Camera'} · {formatBytes(asset.sizeBytes)}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: theme.colors.primary }}>
          {asset.kind === 'photo'
            ? '📷 Photo'
            : `🎬 Video${asset.durationSeconds ? ` · ${asset.durationSeconds}s` : ''}`}
        </p>
      </div>
      {!isSelectMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestore();
          }}
          style={{
            background: theme.colors.primaryLight,
            border: 'none',
            borderRadius: theme.radius.sm,
            padding: '7px 12px',
            fontSize: 13,
            fontWeight: 700,
            color: theme.colors.primary,
            cursor: 'pointer',
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          Restore
        </button>
      )}
    </div>
  );
}

function ConfirmModal({
  step,
  targetCount,
  targetBytes,
  onContinue,
  onFinalDelete,
  onCancel,
}: {
  step: ConfirmStep;
  targetCount: number;
  targetBytes: number;
  onContinue: () => void;
  onFinalDelete: () => void;
  onCancel: () => void;
}) {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: theme.radius.xl,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(15,23,42,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 ? (
          <>
            <h3
              style={{
                margin: '0 0 16px',
                fontSize: 22,
                fontWeight: 800,
                textAlign: 'center',
                color: theme.colors.text,
              }}
            >
              Review Deletion
            </h3>
            <div
              style={{
                background: theme.colors.deleteLight,
                borderRadius: theme.radius.md,
                padding: 16,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, color: '#FCA5A5', fontSize: 15, lineHeight: 1.6 }}>
                You selected{' '}
                <strong>{targetCount} items</strong> and will free up{' '}
                <strong>{formatBytes(targetBytes)}</strong> of storage.
              </p>
            </div>
            <button
              onClick={onContinue}
              style={{
                width: '100%',
                padding: 15,
                background: theme.colors.primary,
                border: 'none',
                borderRadius: theme.radius.md,
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                marginBottom: 4,
                fontFamily: 'inherit',
              }}
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              style={{
                width: '100%',
                padding: 14,
                background: 'none',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                color: theme.colors.muted,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Review Again
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 40 }}>⚠️</span>
            </div>
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 22,
                fontWeight: 800,
                textAlign: 'center',
                color: theme.colors.text,
              }}
            >
              Final Warning
            </h3>
            <p
              style={{
                color: theme.colors.muted,
                fontSize: 14,
                lineHeight: 1.6,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              These items will be removed from SwipeClean. This action{' '}
              <strong>cannot be undone</strong> once confirmed.
            </p>
            <p
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Are you sure you want to permanently delete these items?
            </p>
            <button
              onClick={onFinalDelete}
              style={{
                width: '100%',
                padding: 15,
                background: theme.colors.delete,
                border: 'none',
                borderRadius: theme.radius.md,
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                marginBottom: 4,
                fontFamily: 'inherit',
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={onCancel}
              style={{
                width: '100%',
                padding: 14,
                background: 'none',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                color: theme.colors.muted,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              No, Review Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
