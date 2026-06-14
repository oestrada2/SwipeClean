import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { MediaAsset } from '../types/media';
import { formatBytes } from '../utils/formatBytes';

type MediaCardProps = {
  asset: MediaAsset;
};

export function MediaCard({ asset }: MediaCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: asset.thumbnailUri }} style={styles.image} />
      <View style={styles.meta}>
        <Text style={styles.kind}>{asset.kind === 'photo' ? 'Photo' : 'Video'}</Text>
        <Text style={styles.details}>
          {formatBytes(asset.sizeBytes)}
          {asset.durationSeconds ? ` · ${asset.durationSeconds}s` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%'
  },
  details: {
    color: theme.colors.muted,
    fontSize: 14
  },
  image: {
    aspectRatio: 0.78,
    backgroundColor: theme.colors.border,
    width: '100%'
  },
  kind: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700'
  },
  meta: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md
  }
});
