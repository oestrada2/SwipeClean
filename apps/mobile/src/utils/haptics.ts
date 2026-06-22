let enabled = true;

export function setHapticsEnabled(val: boolean) {
  enabled = val;
}

export function hapticImpact() {
  if (!enabled) return;
  // Replace with: import * as Haptics from 'expo-haptics';
  // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function hapticLight() {
  if (!enabled) return;
  // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticSelection() {
  if (!enabled) return;
  // Haptics.selectionAsync();
}

export function hapticSuccess() {
  if (!enabled) return;
  // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function hapticWarning() {
  if (!enabled) return;
  // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
