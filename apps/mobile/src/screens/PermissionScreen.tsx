import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function PermissionScreen() {
  const { completePermission } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📷</Text>
          </View>
          <Text style={styles.title}>Allow Photo Access</Text>
          <Text style={styles.subtitle}>
            SwipeClean needs access to your photo library to show your photos and
            videos for review.
          </Text>
        </View>

        <View style={styles.permsList}>
          <PermRow icon="👁" text="View your photos and videos" />
          <PermRow icon="🚫" text="Never deletes without your confirmation" />
          <PermRow icon="🔒" text="Your media never leaves your device" />
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.allowBtn} onPress={completePermission}>
            <Text style={styles.allowBtnText}>Allow Access</Text>
          </Pressable>

          <Pressable style={styles.skipBtn} onPress={completePermission}>
            <Text style={styles.skipText}>Skip for Now</Text>
          </Pressable>

          <Text style={styles.note}>
            You can grant access later in Settings → SwipeClean → Photos.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function PermRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={permStyles.row}>
      <View style={permStyles.iconWrap}>
        <Text style={permStyles.icon}>{icon}</Text>
      </View>
      <Text style={permStyles.text}>{text}</Text>
    </View>
  );
}

const permStyles = StyleSheet.create({
  icon: { fontSize: 20 },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  row: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  text: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  allowBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  footer: {
    gap: theme.spacing.md,
  },
  hero: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
  },
  icon: {
    fontSize: 52,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    height: 120,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    width: 120,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  permsList: {
    gap: theme.spacing.sm,
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  skipText: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
});
