'use client';
import { useApp } from '../lib/context';
import { formatBytes } from '../lib/formatBytes';
import { theme } from '../lib/theme';
import type { SessionRecord } from '../lib/types';

export function HistoryView() {
  const { history } = useApp();

  const totalFreed = history.reduce((sum, s) => sum + s.bytesFreed, 0);
  const totalDeleted = history.reduce((sum, s) => sum + s.deletedCount, 0);

  if (history.length === 0) {
    return (
      <div style={{ background: theme.colors.background, minHeight: '100vh' }}>
        <div
          style={{
            padding: '24px 20px 16px',
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.text }}>
            History
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
          <span style={{ fontSize: 64, marginBottom: 24 }}>📋</span>
          <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: theme.colors.text }}>
            No sessions yet
          </h3>
          <p style={{ margin: 0, color: theme.colors.muted, fontSize: 15, lineHeight: 1.6 }}>
            Your cleanup sessions will appear here after your first swipe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          padding: '24px 20px 12px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.text }}>
          History
        </h2>
        <p style={{ margin: '2px 0 0', fontSize: 14, color: theme.colors.muted }}>
          {history.length} session{history.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', gap: 8, margin: '12px 16px 0' }}>
        <TotalChip
          value={String(totalDeleted)}
          label="Total Deleted"
          color={theme.colors.delete}
        />
        <TotalChip
          value={formatBytes(totalFreed)}
          label="Total Freed"
          color={theme.colors.keep}
        />
      </div>

      {/* Sessions */}
      <div style={{ padding: '12px 16px 96px' }}>
        {history.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
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
    <div
      style={{
        flex: 1,
        background: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 16,
        textAlign: 'center',
        boxShadow: '0 1px 4px rgba(15,23,42,0.07)',
      }}
    >
      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color }}>{value}</p>
      <p style={{ margin: '2px 0 0', fontSize: 12, color: theme.colors.muted }}>{label}</p>
    </div>
  );
}

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
    <div
      style={{
        background: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: '16px 20px 20px',
        marginBottom: 10,
      }}
    >
      {/* Date / time header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 16,
          paddingBottom: 14,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.text }}>
          {dateStr}
        </span>
        <span style={{ fontSize: 13, color: theme.colors.muted }}>{timeStr}</span>
      </div>

      {/* 2×2 stat grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px 8px',
        }}
      >
        <StatItem value={String(total)} label="Reviewed" color={theme.colors.primary} />
        <StatItem value={String(session.keptCount)} label="Kept" color={theme.colors.keep} />
        <StatItem value={String(session.deletedCount)} label="Deleted" color={theme.colors.delete} />
        <StatItem value={formatBytes(session.bytesFreed)} label="Freed" color="#8B5CF6" />
      </div>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 12, color: theme.colors.muted, fontWeight: 500 }}>{label}</span>
    </div>
  );
}
