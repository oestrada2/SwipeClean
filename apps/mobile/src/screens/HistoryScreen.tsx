import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { SessionRecord } from '../types/media';
import { formatBytes } from '../utils/formatBytes';

export function HistoryScreen() {
  const { history } = useApp();

  const totalFreed = history.reduce((sum, s) => sum + s.bytesFreed, 0);
  const totalDeleted = history.reduce((sum, s) => sum + s.deletedCount, 0);

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptySub}>
            Your cleanup sessions will appear here after your first swipe.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>{history.length} sessions</Text>
      </View>

      <View style={styles.totalRow}>
        <TotalChip value={String(totalDeleted)} label="Total Deleted" color={theme.colors.delete} />
        <TotalChip value={formatBytes(totalFreed)} label="Total Freed" color={theme.colors.keep} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <SessionCard session={item} />}
      />
    </SafeAreaView>
  );
}

function TotalChip({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={chipStyles.chip}>
      <Text style={[chipStyles.value, { color }]}>{value}</Text>
      <Text style={chipStyles.label}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
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
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
});

function SessionCard({ session }: { session: SessionRecord }) {
  const date = new Date(session.date);
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const total = session.keptCount + session.deletedCount;

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.cardHeader}>
        <Text style={cardStyles.date}>{dateStr}</Text>
        <Text style={cardStyles.time}>{timeStr}</Text>
      </View>
      <View style={cardStyles.stats}>
        <StatItem
          value={String(total)}
          label="Reviewed"
          color={theme.colors.primary}
        />
        <StatItem
          value={String(session.keptCount)}
          label="Kept"
          color={theme.colors.keep}
        />
        <StatItem
          value={String(session.deletedCount)}
          label="Deleted"
          color={theme.colors.delete}
        />
        <StatItem
          value={formatBytes(session.bytesFreed)}
          label="Freed"
          color="#8B5CF6"
        />
      </View>
    </View>
  );
}

function StatItem({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={statStyles.item}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  item: { alignItems: 'center', flex: 1 },
  label: { color: theme.colors.muted, fontSize: 11, marginTop: 2 },
  value: { fontSize: 16, fontWeight: '800' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  date: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
  },
  time: {
    color: theme.colors.muted,
    fontSize: 13,
  },
});

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: { fontSize: 64, marginBottom: theme.spacing.lg },
  emptySub: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  header: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
});
