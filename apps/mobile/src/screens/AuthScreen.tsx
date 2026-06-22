import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function AuthScreen() {
  const { completeAuth } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🧹</Text>
          </View>
          <Text style={styles.appName}>SwipeClean</Text>
          <Text style={styles.tagline}>
            Clean your camera roll in seconds.{'\n'}Swipe. Keep. Delete.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={theme.colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
          />

          <Pressable
            style={styles.primaryBtn}
            onPress={() => completeAuth(false)}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={styles.outlineBtn}
            onPress={() => completeAuth(true)}
          >
            <Text style={styles.outlineBtnText}>Continue as Guest</Text>
          </Pressable>
        </View>

        <Text style={styles.legal}>
          By continuing you agree to our{' '}
          <Text style={styles.legalLink}>Terms</Text> and{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  dividerLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  dividerText: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  form: {
    gap: theme.spacing.sm,
  },
  hero: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    color: theme.colors.text,
    fontSize: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  legal: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  legalLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    height: 88,
    justifyContent: 'center',
    width: 88,
    ...theme.shadow.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  outlineBtn: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    paddingVertical: 15,
  },
  outlineBtnText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
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
  tagline: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
