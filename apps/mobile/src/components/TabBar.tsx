import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Tab } from '../types/media';

type TabConfig = {
  key: Tab;
  label: string;
  icon: string;
};

const TABS: TabConfig[] = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'swipe', label: 'Swipe', icon: '↔' },
  { key: 'delete-bin', label: 'Bin', icon: '🗑' },
  { key: 'history', label: 'History', icon: '◷' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
];

export function TabBar() {
  const { activeTab, setTab, deleteBin } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 4 }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const showBadge = tab.key === 'delete-bin' && deleteBin.length > 0;

        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setTab(tab.key)}
          >
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {tab.icon}
              </Text>
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {deleteBin.length > 99 ? '99+' : deleteBin.length}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    bottom: -2,
    height: 3,
    position: 'absolute',
    width: 20,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: theme.colors.delete,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    paddingHorizontal: 3,
    position: 'absolute',
    right: -6,
    top: -4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  container: {
    backgroundColor: theme.colors.white,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingTop: 10,
    ...theme.shadow.sm,
  },
  icon: {
    color: theme.colors.muted,
    fontSize: 22,
  },
  iconActive: {
    color: theme.colors.primary,
  },
  iconWrap: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
});
