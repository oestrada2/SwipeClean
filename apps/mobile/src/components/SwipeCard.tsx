import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '../constants/theme';
import { MediaAsset } from '../types/media';
import { hapticImpact, hapticLight } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.32;
const FLY_DISTANCE = SCREEN_WIDTH * 1.6;

type Props = {
  asset: MediaAsset;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInfo: () => void;
};

export function SwipeCard({ asset, onSwipeLeft, onSwipeRight, onInfo }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hasTriggered = useSharedValue(false);

  function triggerLeft() {
    hapticImpact();
    onSwipeLeft();
  }

  function triggerRight() {
    hapticLight();
    onSwipeRight();
  }

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.15;

      const crossedThreshold =
        Math.abs(translateX.value) > SWIPE_THRESHOLD && !hasTriggered.value;
      if (crossedThreshold) {
        hasTriggered.value = true;
      }
    })
    .onEnd((e) => {
      const shouldRight =
        translateX.value > SWIPE_THRESHOLD || e.velocityX > 900;
      const shouldLeft =
        translateX.value < -SWIPE_THRESHOLD || e.velocityX < -900;

      if (shouldRight) {
        translateX.value = withTiming(FLY_DISTANCE, { duration: 230 }, (done) => {
          if (done) runOnJS(triggerRight)();
        });
      } else if (shouldLeft) {
        translateX.value = withTiming(-FLY_DISTANCE, { duration: 230 }, (done) => {
          if (done) runOnJS(triggerLeft)();
        });
      } else {
        hasTriggered.value = false;
        translateX.value = withSpring(0, { damping: 18, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH, SCREEN_WIDTH],
          [-20, 20],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  const keepOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, 90], [0, 1], Extrapolation.CLAMP),
  }));

  const deleteOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-90, -20], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image
          source={{ uri: asset.thumbnailUri }}
          style={styles.image}
          resizeMode="cover"
        />

        <Animated.View style={[styles.keepBadge, keepOverlayStyle]}>
          <Text style={styles.keepText}>KEEP</Text>
        </Animated.View>

        <Animated.View style={[styles.deleteBadge, deleteOverlayStyle]}>
          <Text style={styles.deleteText}>DELETE</Text>
        </Animated.View>

        <View style={styles.bottomBar}>
          <View style={styles.metaInfo}>
            <Text style={styles.filename} numberOfLines={1}>
              {asset.filename ?? asset.id}
            </Text>
            <Text style={styles.albumText}>{asset.album ?? 'Camera'}</Text>
          </View>
          <Pressable
            style={styles.infoBtn}
            onPress={onInfo}
            hitSlop={12}
          >
            <Text style={styles.infoBtnText}>ⓘ</Text>
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export function BehindCard({ asset }: { asset: MediaAsset }) {
  return (
    <View style={[styles.card, styles.behindCard]}>
      <Image
        source={{ uri: asset.thumbnailUri }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = CARD_WIDTH * 1.28;

const styles = StyleSheet.create({
  albumText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 1,
  },
  behindCard: {
    opacity: 0.72,
    position: 'absolute',
    transform: [{ scale: 0.94 }, { translateY: 14 }],
  },
  bottomBar: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    position: 'absolute',
    right: 0,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    width: CARD_WIDTH,
    ...theme.shadow.lg,
  },
  deleteBadge: {
    borderColor: theme.colors.delete,
    borderRadius: theme.radius.sm,
    borderWidth: 3,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    top: 24,
    transform: [{ rotate: '-18deg' }],
  },
  deleteText: {
    color: theme.colors.delete,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  filename: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  infoBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  infoBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: theme.radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  keepBadge: {
    borderColor: theme.colors.keep,
    borderRadius: theme.radius.sm,
    borderWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    right: 20,
    top: 24,
    transform: [{ rotate: '18deg' }],
  },
  keepText: {
    color: theme.colors.keep,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  metaInfo: {
    flex: 1,
    paddingBottom: 2,
  },
});
