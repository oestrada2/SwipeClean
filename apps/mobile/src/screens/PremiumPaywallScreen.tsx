import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

const FEATURES = [
  { icon: '🤖', text: 'Smart Cleanup AI — find duplicates, blurry & old photos' },
  { icon: '⎘', text: 'Auto-sort duplicates with one tap' },
  { icon: '📋', text: 'Unlimited session history' },
  { icon: '🔍', text: 'Large video & chat media scanner' },
  { icon: '⚡', text: 'Priority processing for large libraries' },
  { icon: '☁️', text: 'Cloud backup (coming soon)' },
];

export function PremiumPaywallScreen() {
  const { closeModal } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.closeBtn} onPress={closeModal}>
        <Text style={styles.closeBtnText}>✕</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.crownCircle}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
          <Text style={styles.title}>SwipeClean Pro</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of your camera roll cleanup.
          </Text>
        </View>

        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pricingRow}>
          <PricingCard
            period="Monthly"
            price="$2.99"
            unit="/ month"
            isHighlight={false}
          />
          <PricingCard
            period="Yearly"
            price="$19.99"
            unit="/ year"
            badge="Save 44%"
            isHighlight
          />
        </View>

        <Pressable style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Start Free 7-Day Trial</Text>
        </Pressable>

        <Text style={styles.trialNote}>
          Free for 7 days, then $19.99 / year. Cancel anytime.
        </Text>

        <View style={styles.linksRow}>
          <Text style={styles.link}>Restore Purchase</Text>
          <Text style={styles.linkDot}>·</Text>
          <Text style={styles.link}>Privacy Policy</Text>
          <Text style={styles.linkDot}>·</Text>
          <Text style={styles.link}>Terms</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PricingCard({
  period,
  price,
  unit,
  badge,
  isHighlight,
}: {
  period: string;
  price: string;
  unit: string;
  badge?: string;
  isHighlight: boolean;
}) {
  return (
    <View
      style={[
        pricingStyles.card,
        isHighlight && pricingStyles.cardHighlight,
      ]}
    >
      {badge && (
        <View style={pricingStyles.badge}>
          <Text style={pricingStyles.badgeText}>{badge}</Text>
        </View>
      )}
      <Text
        style={[
          pricingStyles.period,
          isHighlight && pricingStyles.periodHighlight,
        ]}
      >
        {period}
      </Text>
      <Text
        style={[
          pricingStyles.price,
          isHighlight && pricingStyles.priceHighlight,
        ]}
      >
        {price}
      </Text>
      <Text
        style={[
          pricingStyles.unit,
          isHighlight && pricingStyles.unitHighlight,
        ]}
      >
        {unit}
      </Text>
    </View>
  );
}

const pricingStyles = StyleSheet.create({
  badge: {
    backgroundColor: '#F59E0B',
    borderRadius: theme.radius.sm,
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    flex: 1,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  cardHighlight: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  period: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  periodHighlight: {
    color: 'rgba(255,255,255,0.8)',
  },
  price: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  priceHighlight: {
    color: '#FFFFFF',
  },
  unit: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  unitHighlight: {
    color: 'rgba(255,255,255,0.7)',
  },
});

const styles = StyleSheet.create({
  closeBtn: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 32,
    justifyContent: 'center',
    margin: theme.spacing.md,
    width: 32,
  },
  closeBtnText: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  crownCircle: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: theme.radius.full,
    height: 100,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    width: 100,
  },
  crownEmoji: {
    fontSize: 52,
  },
  ctaBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    ...theme.shadow.md,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  featureIcon: {
    fontSize: 20,
    width: 32,
  },
  featureList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    gap: 2,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  featureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: 8,
  },
  featureText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  link: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  linkDot: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  linksRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
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
  subtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: theme.spacing.xs,
  },
  trialNote: {
    color: theme.colors.muted,
    fontSize: 13,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
