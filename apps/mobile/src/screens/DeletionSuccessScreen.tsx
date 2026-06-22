import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatBytes } from '../utils/formatBytes';

export function DeletionSuccessScreen() {
  const { deletionStats, closeModal, setTab } = useApp();

  if (!deletionStats) return null;

  const { deletedCount, bytesFreed } = deletionStats;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>All Cleaned Up!</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              You cleaned{' '}
              <Text style={styles.summaryBold}>{deletedCount} {deletedCount === 1 ? 'item' : 'items'}</Text>
              {bytesFreed > 0 && (
                <>
                  {' '}and freed{' '}
                  <Text style={styles.summaryBold}>{formatBytes(bytesFreed)}</Text>
                  {' '}today.
                </>
              )}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Items have been sent to your phone's recently deleted folder. They will be
            permanently removed when you empty your system trash.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              closeModal();
              setTab('home');
            }}
          >
            <Text style={styles.primaryBtnText}>Back to Home</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              closeModal();
              setTab('swipe');
            }}
          >
            <Text style={styles.secondaryBtnText}>Keep Cleaning</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm,
  },
  container: {
    flex: 1,
    gap: theme.spacing.xl,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emoji: {
    fontSize: 88,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    paddingVertical: 15,
  },
  secondaryBtnText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryBold: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  summaryBox: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    width: '100%',
  },
  summaryText: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
