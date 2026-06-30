'use client';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabase';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const { completeAuth } = useApp();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!email || !password) { setError('Email and password required.'); return; }
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); return; }
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) { setError(err.message); return; }
        setError('Check your email to confirm your account, then sign in.');
        setMode('signin');
        return;
      }
      completeAuth(false);
    } finally {
      setLoading(false);
    }
  }

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
          {/* Mode toggle */}
          <View style={styles.modeRow}>
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <Pressable
                key={m}
                onPress={() => { setMode(m); setError(null); }}
                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              >
                <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={theme.colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Pressable style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
            }
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.outlineBtn} onPress={() => completeAuth(true)}>
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
  dividerLine: { backgroundColor: theme.colors.border, flex: 1, height: 1 },
  dividerRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.md, marginVertical: theme.spacing.sm },
  dividerText: { color: theme.colors.muted, fontSize: 14 },
  errorText: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginTop: -4 },
  form: { gap: theme.spacing.sm },
  hero: { alignItems: 'center', paddingTop: theme.spacing.xxl },
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
  legal: { color: theme.colors.muted, fontSize: 13, textAlign: 'center' },
  legalLink: { color: theme.colors.primary, fontWeight: '600' },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    height: 88,
    justifyContent: 'center',
    width: 88,
    ...theme.shadow.md,
  },
  logoEmoji: { fontSize: 40 },
  modeBtn: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    flex: 1,
    paddingVertical: 10,
  },
  modeBtnActive: { backgroundColor: theme.colors.primary },
  modeBtnText: { color: theme.colors.muted, fontSize: 14, fontWeight: '600' },
  modeBtnTextActive: { color: '#fff' },
  modeRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    padding: 4,
    marginBottom: theme.spacing.xs,
  },
  outlineBtn: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    paddingVertical: 15,
  },
  outlineBtnText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
    paddingVertical: 15,
    ...theme.shadow.sm,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  safe: { backgroundColor: theme.colors.background, flex: 1 },
  tagline: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center' },
});
