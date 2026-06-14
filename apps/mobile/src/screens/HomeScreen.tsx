import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MediaCard } from '../components/MediaCard';
import { SwipeActions } from '../components/SwipeActions';
import { theme } from '../constants/theme';
import { useMediaQueue } from '../hooks/useMediaQueue';

export function HomeScreen() {
  const { currentAsset, decide, isComplete, isLoading, progress } = useMediaQueue();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SwipeClean</Text>
          <Text style={styles.subtitle}>
            {progress.reviewed} of {progress.total} reviewed
          </Text>
        </View>

        {isLoading ? <ActivityIndicator color={theme.colors.primary} size="large" /> : null}

        {!isLoading && currentAsset ? (
          <>
            <MediaCard asset={currentAsset} />
            <SwipeActions onDecision={decide} />
          </>
        ) : null}

        {isComplete ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>All caught up</Text>
            <Text style={styles.emptyText}>Your review queue is clear for now.</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.lg
  },
  emptyState: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 16
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800'
  },
  header: {
    alignSelf: 'stretch',
    gap: theme.spacing.xs
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 15
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800'
  }
});
