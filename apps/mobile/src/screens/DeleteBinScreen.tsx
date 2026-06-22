import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { MediaAsset } from '../types/media';
import { formatBytes } from '../utils/formatBytes';
import { hapticImpact, hapticSelection, hapticWarning } from '../utils/haptics';

type FilterKind = 'all' | 'photo' | 'video';
type DeleteTarget = 'selected' | 'all';
type ConfirmStep = 1 | 2;

export function DeleteBinScreen() {
  const { deleteBin, removeFromDeleteBin, removeManyFromDeleteBin, clearDeleteBin, showDeletionSuccess } =
    useApp();

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
  const allSelected = filteredBin.length > 0 && filteredBin.every((a) => selectedIds.has(a.id));

  function enterSelectMode() {
    setIsSelectMode(true);
    setSelectedIds(new Set());
  }

  function exitSelectMode() {
    setIsSelectMode(false);
    setSelectedIds(new Set());
  }

  function toggleItem(id: string) {
    hapticSelection();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBin.map((a) => a.id)));
    }
  }, [allSelected, filteredBin]);

  function handleRestoreSelected() {
    hapticSelection();
    selectedItems.forEach((a) => removeFromDeleteBin(a.id));
    exitSelectMode();
  }

  function handleRestoreAll() {
    hapticSelection();
    clearDeleteBin();
    exitSelectMode();
  }

  function openDeleteConfirm(target: DeleteTarget) {
    hapticWarning();
    setDeleteTarget(target);
    setConfirmStep(1);
    setShowConfirm(true);
  }

  function handleConfirmContinue() {
    setConfirmStep(2);
  }

  function handleFinalDelete() {
    hapticImpact();
    const ids = targetItems.map((a) => a.id);
    const bytes = targetBytes;
    const count = targetItems.length;

    removeManyFromDeleteBin(ids);
    setShowConfirm(false);
    exitSelectMode();
    showDeletionSuccess({ deletedCount: count, bytesFreed: bytes });
  }

  function handleCancelConfirm() {
    setShowConfirm(false);
  }

  if (deleteBin.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Delete Bin</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🗑️</Text>
          <Text style={styles.emptyTitle}>Bin is empty</Text>
          <Text style={styles.emptySub}>
            Items you swipe left will appear here for review before deletion.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Delete Bin</Text>
          <Text style={styles.subtitle}>
            {deleteBin.length} items · {formatBytes(totalBinBytes)}
          </Text>
        </View>
        <Pressable
          style={styles.selectBtn}
          onPress={isSelectMode ? exitSelectMode : enterSelectMode}
        >
          <Text style={styles.selectBtnText}>
            {isSelectMode ? 'Done' : 'Select'}
          </Text>
        </Pressable>
      </View>

      {/* Summary + quick actions (non-select mode) */}
      {!isSelectMode && (
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryBytes}>{formatBytes(totalBinBytes)}</Text>
            <Text style={styles.summaryLabel}>ready to free</Text>
          </View>
          <View style={styles.summaryActions}>
            <Pressable style={styles.restoreAllBtn} onPress={handleRestoreAll}>
              <Text style={styles.restoreAllText}>Restore All</Text>
            </Pressable>
            <Pressable
              style={styles.deleteAllBtn}
              onPress={() => openDeleteConfirm('all')}
            >
              <Text style={styles.deleteAllText}>Delete All</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Select mode: select-all row */}
      {isSelectMode && (
        <View style={styles.selectAllRow}>
          <Pressable style={styles.checkboxRow} onPress={toggleSelectAll}>
            <View style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
              {allSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.selectAllText}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Text>
          </Pressable>
          <Text style={styles.selectedCount}>
            {selectedIds.size} selected
          </Text>
        </View>
      )}

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(['all', 'photo', 'video'] as FilterKind[]).map((kind) => {
          const label = kind === 'all' ? 'All' : kind === 'photo' ? 'Photos' : 'Videos';
          const count =
            kind === 'all'
              ? deleteBin.length
              : deleteBin.filter((a) => a.kind === kind).length;
          return (
            <Pressable
              key={kind}
              style={[styles.filterChip, filterKind === kind && styles.filterChipActive]}
              onPress={() => setFilterKind(kind)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterKind === kind && styles.filterChipTextActive,
                ]}
              >
                {label} {count > 0 ? `(${count})` : ''}
              </Text>
            </Pressable>
          );
        })}
        {/* Album chips */}
        {[...new Set(deleteBin.map((a) => a.album).filter(Boolean))].map(
          (album) => (
            <Pressable key={album} style={styles.filterChip} onPress={() => {}}>
              <Text style={styles.filterChipText}>{album}</Text>
            </Pressable>
          )
        )}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filteredBin}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BinItem
            asset={item}
            isSelectMode={isSelectMode}
            isSelected={selectedIds.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            onRestore={() => removeFromDeleteBin(item.id)}
          />
        )}
      />

      {/* Select mode bottom action bar */}
      {isSelectMode && selectedIds.size > 0 && (
        <View style={styles.actionBar}>
          <Pressable style={styles.actionBarRestore} onPress={handleRestoreSelected}>
            <Text style={styles.actionBarRestoreText}>
              Restore ({selectedIds.size})
            </Text>
          </Pressable>
          <Pressable
            style={styles.actionBarDelete}
            onPress={() => openDeleteConfirm('selected')}
          >
            <Text style={styles.actionBarDeleteText}>
              Delete ({selectedIds.size})
            </Text>
          </Pressable>
        </View>
      )}

      {/* Confirmation modal */}
      <ConfirmModal
        visible={showConfirm}
        step={confirmStep}
        targetCount={targetItems.length}
        targetBytes={targetBytes}
        onContinue={handleConfirmContinue}
        onFinalDelete={handleFinalDelete}
        onCancel={handleCancelConfirm}
      />
    </SafeAreaView>
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
  return (
    <Pressable style={itemStyles.row} onPress={isSelectMode ? onToggle : undefined}>
      {isSelectMode && (
        <View style={[itemStyles.checkbox, isSelected && itemStyles.checkboxChecked]}>
          {isSelected && <Text style={itemStyles.checkmark}>✓</Text>}
        </View>
      )}
      <Image source={{ uri: asset.thumbnailUri }} style={itemStyles.thumb} />
      <View style={itemStyles.info}>
        <Text style={itemStyles.filename} numberOfLines={1}>
          {asset.filename ?? asset.id}
        </Text>
        <Text style={itemStyles.meta}>
          {asset.album ?? 'Camera'} · {formatBytes(asset.sizeBytes)}
        </Text>
        <Text style={itemStyles.kind}>
          {asset.kind === 'photo' ? '📷 Photo' : `🎬 Video${asset.durationSeconds ? ` · ${asset.durationSeconds}s` : ''}`}
        </Text>
      </View>
      {!isSelectMode && (
        <Pressable style={itemStyles.restoreBtn} onPress={onRestore}>
          <Text style={itemStyles.restoreText}>Restore</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

function ConfirmModal({
  visible,
  step,
  targetCount,
  targetBytes,
  onContinue,
  onFinalDelete,
  onCancel,
}: {
  visible: boolean;
  step: ConfirmStep;
  targetCount: number;
  targetBytes: number;
  onContinue: () => void;
  onFinalDelete: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          {step === 1 ? (
            <>
              <Text style={modalStyles.title}>Review Deletion</Text>
              <View style={modalStyles.summaryBox}>
                <Text style={modalStyles.summaryText}>
                  You selected{' '}
                  <Text style={modalStyles.summaryBold}>{targetCount} items</Text>
                  {' '}and will free up{' '}
                  <Text style={modalStyles.summaryBold}>{formatBytes(targetBytes)}</Text>
                  {' '}of storage.
                </Text>
              </View>
              <Pressable style={modalStyles.continueBtn} onPress={onContinue}>
                <Text style={modalStyles.continueBtnText}>Continue</Text>
              </Pressable>
              <Pressable style={modalStyles.cancelBtn} onPress={onCancel}>
                <Text style={modalStyles.cancelBtnText}>Review Again</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={modalStyles.warningIcon}>
                <Text style={modalStyles.warningEmoji}>⚠️</Text>
              </View>
              <Text style={modalStyles.title}>Final Warning</Text>
              <Text style={modalStyles.warningText}>
                These items will be deleted from SwipeClean and sent to your phone's
                trash / recently deleted. This action{' '}
                <Text style={modalStyles.warningBold}>may not be reversible</Text>{' '}
                after the system trash is emptied.
              </Text>
              <Text style={modalStyles.questionText}>
                Are you sure you want to permanently delete these items?
              </Text>
              <Pressable style={modalStyles.deleteBtn} onPress={onFinalDelete}>
                <Text style={modalStyles.deleteBtnText}>Yes, Delete</Text>
              </Pressable>
              <Pressable style={modalStyles.cancelBtn} onPress={onCancel}>
                <Text style={modalStyles.cancelBtnText}>No, Review Again</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const itemStyles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  filename: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  kind: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 3,
  },
  meta: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  restoreBtn: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  restoreText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    ...theme.shadow.sm,
  },
  thumb: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    height: 64,
    width: 64,
  },
});

const modalStyles = StyleSheet.create({
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelBtnText: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  continueBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginBottom: 4,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.delete,
    borderRadius: theme.radius.md,
    marginBottom: 4,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  questionText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    ...theme.shadow.lg,
  },
  summaryBold: {
    color: theme.colors.delete,
    fontWeight: '800',
  },
  summaryBox: {
    backgroundColor: theme.colors.deleteLight,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  summaryText: {
    color: '#7F1D1D',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  warningBold: {
    fontWeight: '800',
  },
  warningEmoji: {
    fontSize: 40,
  },
  warningIcon: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  warningText: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  actionBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  actionBarDelete: {
    alignItems: 'center',
    backgroundColor: theme.colors.delete,
    borderRadius: theme.radius.md,
    flex: 1,
    paddingVertical: 14,
    ...theme.shadow.sm,
  },
  actionBarDeleteText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionBarRestore: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    flex: 1,
    paddingVertical: 14,
  },
  actionBarRestoreText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  deleteAllBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.delete,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    ...theme.shadow.sm,
  },
  deleteAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: theme.spacing.lg,
  },
  emptySub: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  filterChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    marginRight: theme.spacing.xs,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterRow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  restoreAllBtn: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
  },
  restoreAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  selectAllText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  selectAllRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  selectBtn: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  selectBtnText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  selectedCount: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  summaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  summaryBytes: {
    color: theme.colors.delete,
    fontSize: 22,
    fontWeight: '800',
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  summaryLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
});
