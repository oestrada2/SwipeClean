import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  {
    id: 'duplicates',
    icon: '⎘',
    title: 'Duplicates',
    desc: 'Photos that look nearly identical',
    count: 23,
    isPro: false,
  },
  {
    id: 'blurry',
    icon: '🌫',
    title: 'Blurry Photos',
    desc: 'Out-of-focus and shaky shots',
    count: 41,
    isPro: false,
  },
  {
    id: 'screenshots',
    icon: '📸',
    title: 'Screenshots',
    desc: 'Screen captures from apps and websites',
    count: 118,
    isPro: false,
  },
  {
    id: 'large-videos',
    icon: '🎬',
    title: 'Large Videos',
    desc: 'Videos over 500 MB',
    count: 8,
    isPro: true,
  },
  {
    id: 'old-photos',
    icon: '🕰',
    title: 'Old Photos',
    desc: 'Photos older than 2 years not viewed',
    count: 203,
    isPro: true,
  },
  {
    id: 'whatsapp',
    icon: '💬',
    title: 'Chat Media',
    desc: 'Received images and videos from chats',
    count: 512,
    isPro: true,
  },
];

export function SmartCleanupScreen() {
  const { closeModal, openModal } = useApp();

  function handleScanNow() {
    closeModal();
    openModal('premium');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.closeBtn} onPress={closeModal}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Smart Cleanup</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heroText}>
          AI-powered analysis found potential cleanup items in your library.
        </Text>

        {CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.catCard}>
            <View style={styles.catLeft}>
              <View style={styles.catIconCircle}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
              </View>
              <View style={styles.catInfo}>
                <View style={styles.catTitleRow}>
                  <Text style={styles.catTitle}>{cat.title}</Text>
                  {cat.isPro && (
                    <View style={styles.proTag}>
                      <Text style={styles.proText}>PRO</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.catDesc}>{cat.desc}</Text>
                {!cat.isPro && (
                  <Text style={styles.catCount}>{cat.count} items found</Text>
                )}
              </View>
            </View>
            {cat.isPro ? (
              <Pressable style={styles.unlockBtn} onPress={() => openModal('premium')}>
                <Text style={styles.unlockText}>🔒</Text>
              </Pressable>
            ) : (
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.white}
              />
            )}
          </View>
        ))}

        <Pressable style={styles.scanBtn} onPress={handleScanNow}>
          <Text style={styles.scanBtnText}>Scan Library Now</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  catCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  catCount: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  catDesc: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  catIcon: {
    fontSize: 22,
  },
  catIconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
    height: 44,
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    width: 44,
  },
  catInfo: {
    flex: 1,
  },
  catLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  catTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  catTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  closeBtnText: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  heroText: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  placeholder: {
    height: 32,
    width: 32,
  },
  proTag: {
    backgroundColor: '#F59E0B',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scanBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  unlockBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  unlockText: {
    fontSize: 16,
  },
});
