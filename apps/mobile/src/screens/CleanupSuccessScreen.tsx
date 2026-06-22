import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function CleanupSuccessScreen() {
  const { cleanupStats, closeModal, setTab } = useApp();

  if (!cleanupStats) return null;

  const { keptCount, deletedCount } = cleanupStats;
  const total = keptCount + deletedCount;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Great Job!</Text>
          <Text style={styles.subtitle}>
            You reviewed {total} {total === 1 ? 'item' : 'items'} in this session.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatPill
            value={String(keptCount)}
            label="Kept"
            color={theme.colors.keep}
            bg={theme.colors.keepLight}
          />
          <StatPill
            value={String(deletedCount)}
            label="In Delete Bin"
            color={theme.colors.delete}
            bg={theme.colors.deleteLight}
          />
        </View>

        {deletedCount > 0 && (
          <View style={styles.binNote}>
            <Text style={styles.binNoteText}>
              {deletedCount} {deletedCount === 1 ? 'item sits' : 'items sit'} in your Delete Bin.
              Review and confirm deletion to free storage.
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          {deletedCount > 0 && (
            <Pressable
              style={styles.primaryBtn}
              onPress={() => {
                closeModal();
                setTab('delete-bin');
              }}
            >
              <Text style={styles.primaryBtnText}>View Delete Bin</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              closeModal();
              setTab('swipe');
            }}
          >
            <Text style={styles.secondaryBtnText}>Keep Cleaning</Text>
          </Pressable>

          <Pressable
            style={styles.ghostBtn}
            onPress={() => {
              closeModal();
              setTab('home');
            }}
          >
            <Text style={styles.ghostBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StatPill({
  value,
  label,
  color,
  bg,
}: {
  value: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[pillStyles.pill, { backgroundColor: bg }]}>
      <Text style={[pillStyles.value, { color }]}>{value}</Text>
      <Text style={[pillStyles.label, { color }]}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  pill: {
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  value: {
    fontSize: 36,
    fontWeight: '800',
  },
});

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm,
  },
  binNote: {
    backgroundColor: theme.colors.deleteLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  binNoteText: {
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  ghostBtnText: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  hero: {
    alignItems: 'center',
  },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.delete,
    borderRadius: theme.radius.md,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  secondaryBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
});
