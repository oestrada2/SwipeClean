import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { SwipeDecision } from '../types/media';

type SwipeActionsProps = {
  onDecision: (decision: SwipeDecision) => void;
};

export function SwipeActions({ onDecision }: SwipeActionsProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="Mark for deletion"
        onPress={() => onDecision('delete')}
        style={[styles.button, styles.deleteButton]}
      >
        <Text style={[styles.label, styles.deleteText]}>Delete</Text>
      </Pressable>

      <Pressable
        accessibilityLabel="Keep media"
        onPress={() => onDecision('keep')}
        style={[styles.button, styles.keepButton]}
      >
        <Text style={[styles.label, styles.keepText]}>Keep</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    minHeight: 56
  },
  deleteButton: {
    borderColor: theme.colors.delete
  },
  deleteText: {
    color: theme.colors.delete
  },
  keepButton: {
    borderColor: theme.colors.keep
  },
  keepText: {
    color: theme.colors.keep
  },
  label: {
    fontSize: 16,
    fontWeight: '700'
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%'
  }
});
