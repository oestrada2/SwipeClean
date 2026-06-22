import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatBytes } from '../utils/formatBytes';

export function HomeDashboard() {
  const { deleteBin, history, setTab, openModal, isGuest } = useApp();

  const binBytes = deleteBin.reduce((sum, a) => sum + a.sizeBytes, 0);
  const totalReviewed = history.reduce(
    (sum, s) => sum + s.keptCount + s.deletedCount,
    0
  );
  const totalFreed = history.reduce((sum, s) => sum + s.bytesFreed, 0);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning{isGuest ? '' : ' 👋'}</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.logoMini}>
            <Text style={styles.logoEmoji}>🧹</Text>
          </View>
        </View>

        {/* Start Cleaning CTA */}
        <Pressable
          style={styles.ctaCard}
          onPress={() => setTab('swipe')}
        >
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaTitle}>Start Cleaning</Text>
            <Text style={styles.ctaSubtitle}>
              Review and organize your photo library
            </Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>

        {/* Delete Bin summary */}
        <Pressable
          style={styles.binCard}
          onPress={() => setTab('delete-bin')}
        >
          <View style={styles.binLeft}>
            <Text style={styles.binIcon}>🗑</Text>
            <View>
              <Text style={styles.binTitle}>Delete Bin</Text>
              <Text style={styles.binSub}>
                {deleteBin.length > 0
                  ? `${deleteBin.length} items · ${formatBytes(binBytes)} ready to free`
                  : 'Empty — nothing to delete'}
              </Text>
            </View>
          </View>
          <Text style={styles.binChevron}>›</Text>
        </Pressable>

        {/* Stats grid */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard
            value={String(totalReviewed)}
            label="Total Reviewed"
            color={theme.colors.primary}
          />
          <StatCard
            value={formatBytes(totalFreed)}
            label="Space Freed"
            color={theme.colors.keep}
          />
          <StatCard
            value={String(history.length)}
            label="Sessions"
            color="#8B5CF6"
          />
          <StatCard
            value={String(deleteBin.length)}
            label="In Bin"
            color={theme.colors.delete}
          />
        </View>

        {/* Smart Cleanup card */}
        <Pressable
          style={styles.smartCard}
          onPress={() => openModal('smart-cleanup')}
        >
          <View style={styles.smartLeft}>
            <View style={styles.proTag}>
              <Text style={styles.proText}>PRO</Text>
            </View>
            <Text style={styles.smartTitle}>Smart Cleanup</Text>
            <Text style={styles.smartSub}>
              Find duplicates, blurry shots, screenshots and more automatically.
            </Text>
          </View>
          <Text style={styles.smartArrow}>✨</Text>
        </Pressable>

        {/* Recent sessions */}
        {history.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <View style={styles.recentList}>
              {history.slice(0, 3).map((s) => {
                const d = new Date(s.date);
                const label = d.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <View key={s.id} style={styles.sessionRow}>
                    <Text style={styles.sessionDate}>{label}</Text>
                    <Text style={styles.sessionStat}>
                      {s.deletedCount} deleted
                    </Text>
                    <Text style={styles.sessionFreed}>
                      {formatBytes(s.bytesFreed)} freed
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={statStyles.card}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    flex: 1,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
});

const styles = StyleSheet.create({
  binCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  binChevron: {
    color: theme.colors.muted,
    fontSize: 24,
  },
  binIcon: {
    fontSize: 28,
    marginRight: theme.spacing.md,
  },
  binLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  binSub: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  binTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadow.md,
  },
  ctaLeft: {
    flex: 1,
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  date: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  greeting: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  logoEmoji: {
    fontSize: 28,
  },
  logoMini: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  proTag: {
    backgroundColor: '#F59E0B',
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  recentList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  sessionDate: {
    color: theme.colors.muted,
    fontSize: 14,
    width: 60,
  },
  sessionFreed: {
    color: theme.colors.keep,
    fontSize: 14,
    fontWeight: '600',
  },
  sessionRow: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  sessionStat: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  smartArrow: {
    fontSize: 32,
  },
  smartCard: {
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.md,
  },
  smartLeft: {
    flex: 1,
  },
  smartSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  smartTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
});
