import { useCallback, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BehindCard, SwipeCard } from '../components/SwipeCard';
import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { mockMedia } from '../services/mockMedia';
import { MediaAsset } from '../types/media';
import { formatBytes } from '../utils/formatBytes';
import { hapticSelection } from '../utils/haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type LastAction = {
  asset: MediaAsset;
  decision: 'keep' | 'delete';
};

export function SwipeScreen() {
  const { addToDeleteBin, removeFromDeleteBin, addSessionToHistory, setTab } =
    useApp();

  const [queue] = useState<MediaAsset[]>(mockMedia);
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
    hapticSelection();
    if (lastAction.decision === 'delete') {
      removeFromDeleteBin(lastAction.asset.id);
      setDeletedCount((n) => Math.max(0, n - 1));
    } else {
      setKeptCount((n) => Math.max(0, n - 1));
    }
    setCurrentIndex((i) => i - 1);
    setLastAction(null);
  }, [lastAction, removeFromDeleteBin]);

  function handleFinish() {
    addSessionToHistory({
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      keptCount,
      deletedCount,
      bytesFreed: 0,
    });
    setTab('delete-bin');
  }

  if (isComplete) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>✅</Text>
          <Text style={styles.doneTitle}>Session Done!</Text>
          <Text style={styles.doneSub}>
            Reviewed {queue.length} items.{'\n'}
            {deletedCount} item{deletedCount !== 1 ? 's' : ''} waiting in Delete Bin.
          </Text>
          <Pressable style={styles.doneBtn} onPress={handleFinish}>
            <Text style={styles.doneBtnText}>Review Delete Bin →</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.progress}>
            {currentIndex + 1} / {queue.length}
          </Text>
          <Text style={styles.headerTitle}>Swipe to Review</Text>
          <Pressable
            style={[styles.undoBtn, !lastAction && styles.undoBtnDisabled]}
            onPress={handleUndo}
            disabled={!lastAction}
          >
            <Text style={[styles.undoBtnText, !lastAction && styles.undoBtnTextDisabled]}>
              ↩ Undo
            </Text>
          </Pressable>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentIndex / queue.length) * 100}%` },
            ]}
          />
        </View>

        {/* Card stack area */}
        <View style={styles.cardArea}>
          {nextAsset && <BehindCard asset={nextAsset} />}
          {currentAsset && (
            <SwipeCard
              key={currentAsset.id}
              asset={currentAsset}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onInfo={() => setInfoAsset(currentAsset)}
            />
          )}
        </View>

        {/* Hint */}
        <View style={styles.hintRow}>
          <View style={styles.hintDelete}>
            <Text style={styles.hintDeleteText}>← DELETE</Text>
          </View>
          <View style={styles.hintKeep}>
            <Text style={styles.hintKeepText}>KEEP →</Text>
          </View>
        </View>
      </View>

      {/* Info modal */}
      <Modal
        visible={infoAsset !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setInfoAsset(null)}
      >
        <Pressable style={styles.infoOverlay} onPress={() => setInfoAsset(null)}>
          <Pressable style={styles.infoSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.infoHandle} />
            <Text style={styles.infoTitle}>File Details</Text>
            <ScrollView>
              {infoAsset && (
                <View style={styles.infoRows}>
                  <InfoRow label="Filename" value={infoAsset.filename ?? infoAsset.id} />
                  <InfoRow
                    label="Type"
                    value={infoAsset.kind === 'photo' ? 'Photo' : 'Video'}
                  />
                  <InfoRow label="Size" value={formatBytes(infoAsset.sizeBytes)} />
                  <InfoRow
                    label="Album"
                    value={infoAsset.album ?? 'Camera'}
                  />
                  <InfoRow
                    label="Resolution"
                    value={
                      infoAsset.width && infoAsset.height
                        ? `${infoAsset.width} × ${infoAsset.height}`
                        : '—'
                    }
                  />
                  {infoAsset.durationSeconds && (
                    <InfoRow
                      label="Duration"
                      value={`${infoAsset.durationSeconds}s`}
                    />
                  )}
                  <InfoRow
                    label="Date Taken"
                    value={new Date(infoAsset.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  />
                </View>
              )}
            </ScrollView>
            <Pressable
              style={styles.infoCloseBtn}
              onPress={() => setInfoAsset(null)}
            >
              <Text style={styles.infoCloseBtnText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoRowStyles.row}>
      <Text style={infoRowStyles.label}>{label}</Text>
      <Text style={infoRowStyles.value}>{value}</Text>
    </View>
  );
}

const infoRowStyles = StyleSheet.create({
  label: {
    color: theme.colors.muted,
    fontSize: 14,
    width: 100,
  },
  row: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  value: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});

const CARD_AREA_HEIGHT = SCREEN_HEIGHT * 0.56;

const styles = StyleSheet.create({
  cardArea: {
    alignItems: 'center',
    height: CARD_AREA_HEIGHT,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  doneBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  doneContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  doneEmoji: {
    fontSize: 72,
    marginBottom: theme.spacing.lg,
  },
  doneSub: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  doneTitle: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  hintDelete: {
    alignItems: 'center',
    backgroundColor: theme.colors.deleteLight,
    borderRadius: theme.radius.md,
    flex: 1,
    paddingVertical: 10,
  },
  hintDeleteText: {
    color: theme.colors.delete,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintKeep: {
    alignItems: 'center',
    backgroundColor: theme.colors.keepLight,
    borderRadius: theme.radius.md,
    flex: 1,
    paddingVertical: 10,
  },
  hintKeepText: {
    color: theme.colors.keep,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  infoCloseBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    paddingVertical: 14,
  },
  infoCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  infoHandle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 4,
    marginBottom: theme.spacing.md,
    width: 40,
  },
  infoOverlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  infoRows: {
    gap: 0,
  },
  infoSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: '70%',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  infoTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
  },
  progress: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 60,
  },
  progressBar: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 3,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    height: '100%',
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  undoBtn: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    minWidth: 60,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
  },
  undoBtnDisabled: {
    opacity: 0.35,
  },
  undoBtnText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  undoBtnTextDisabled: {
    color: theme.colors.muted,
  },
});
