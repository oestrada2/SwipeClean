import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function SettingsScreen() {
  const { isGuest, hapticsEnabled, toggleHaptics, openModal, signOut, deleteBin } =
    useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}
        <SectionHeader label="Account" />
        <View style={styles.section}>
          <View style={styles.accountRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{isGuest ? '👤' : '😊'}</Text>
            </View>
            <View>
              <Text style={styles.accountName}>
                {isGuest ? 'Guest User' : 'SwipeClean User'}
              </Text>
              <Text style={styles.accountEmail}>
                {isGuest ? 'Not signed in' : 'user@example.com'}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <SectionHeader label="Preferences" />
        <View style={styles.section}>
          <ToggleRow
            icon="📳"
            label="Haptic Feedback"
            desc="Vibrate on swipe actions"
            value={hapticsEnabled}
            onToggle={toggleHaptics}
          />
          <View style={styles.rowDivider} />
          <ToggleRow
            icon="⚡"
            label="Auto-Delete"
            desc="Remove bin items after 30 days"
            value={false}
            onToggle={() => {}}
            disabled
            proLabel
          />
        </View>

        {/* Storage */}
        <SectionHeader label="Storage" />
        <View style={styles.section}>
          <ActionRow
            icon="🗑"
            label="Delete Bin"
            desc={`${deleteBin.length} items pending`}
            onPress={() => {}}
          />
        </View>

        {/* Pro */}
        <SectionHeader label="SwipeClean Pro" />
        <Pressable
          style={styles.proCard}
          onPress={() => openModal('premium')}
        >
          <Text style={styles.proCardEmoji}>👑</Text>
          <View style={styles.proCardText}>
            <Text style={styles.proCardTitle}>Upgrade to Pro</Text>
            <Text style={styles.proCardSub}>
              Smart Cleanup, unlimited history & more
            </Text>
          </View>
          <Text style={styles.proCardArrow}>›</Text>
        </Pressable>

        <Pressable
          style={[styles.section, styles.actionRowPressable]}
          onPress={() => openModal('smart-cleanup')}
        >
          <ActionRow
            icon="✨"
            label="Smart Cleanup"
            desc="AI-powered library analysis"
            onPress={() => openModal('smart-cleanup')}
          />
        </Pressable>

        {/* About */}
        <SectionHeader label="About" />
        <View style={styles.section}>
          <ActionRow icon="🔒" label="Privacy Policy" desc="" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <ActionRow icon="📄" label="Terms of Service" desc="" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <ActionRow
            icon="ℹ"
            label="App Version"
            desc="0.1.0"
            onPress={() => {}}
            isValue
          />
        </View>

        {/* Sign out */}
        <Pressable style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <Text style={headerStyles.label}>{label}</Text>;
}

const headerStyles = StyleSheet.create({
  label: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
    textTransform: 'uppercase',
  },
});

function ToggleRow({
  icon,
  label,
  desc,
  value,
  onToggle,
  disabled,
  proLabel,
}: {
  icon: string;
  label: string;
  desc: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  proLabel?: boolean;
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.icon}>{icon}</Text>
      <View style={rowStyles.info}>
        <View style={rowStyles.labelRow}>
          <Text style={rowStyles.label}>{label}</Text>
          {proLabel && (
            <View style={rowStyles.proTag}>
              <Text style={rowStyles.proText}>PRO</Text>
            </View>
          )}
        </View>
        {desc ? <Text style={rowStyles.desc}>{desc}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.white}
      />
    </View>
  );
}

function ActionRow({
  icon,
  label,
  desc,
  onPress,
  isValue,
}: {
  icon: string;
  label: string;
  desc: string;
  onPress: () => void;
  isValue?: boolean;
}) {
  return (
    <Pressable style={rowStyles.row} onPress={onPress}>
      <Text style={rowStyles.icon}>{icon}</Text>
      <View style={rowStyles.info}>
        <Text style={rowStyles.label}>{label}</Text>
        {desc && !isValue ? <Text style={rowStyles.desc}>{desc}</Text> : null}
      </View>
      <Text style={rowStyles.chevron}>
        {isValue ? desc : '›'}
      </Text>
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  chevron: {
    color: theme.colors.muted,
    fontSize: 20,
  },
  desc: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
    width: 28,
  },
  info: {
    flex: 1,
  },
  label: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  proTag: {
    backgroundColor: '#F59E0B',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
  },
});

const styles = StyleSheet.create({
  accountEmail: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 1,
  },
  accountName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingVertical: 6,
  },
  actionRowPressable: {
    paddingVertical: 0,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  header: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  proCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  proCardArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 24,
  },
  proCardEmoji: {
    fontSize: 28,
  },
  proCardSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 1,
  },
  proCardText: {
    flex: 1,
  },
  proCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  rowDivider: {
    backgroundColor: theme.colors.border,
    height: StyleSheet.hairlineWidth,
    marginLeft: 44,
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    paddingTop: 0,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadow.sm,
  },
  signOutBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.delete,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    marginTop: theme.spacing.lg,
    paddingVertical: 14,
  },
  signOutText: {
    color: theme.colors.delete,
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
});
