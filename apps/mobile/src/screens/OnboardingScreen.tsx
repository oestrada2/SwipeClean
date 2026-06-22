import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: '↔️',
    title: 'Swipe to Review',
    body: 'Go through your photos and videos one by one. Swipe right to keep, swipe left to send to the Delete Bin.',
    bg: theme.colors.primaryLight,
  },
  {
    id: '2',
    icon: '🗑️',
    title: 'Build Your Delete Bin',
    body: 'Nothing is deleted while you swipe. Review everything in your Delete Bin before freeing the space.',
    bg: '#DCFCE7',
  },
  {
    id: '3',
    icon: '💾',
    title: 'Free Up Storage',
    body: 'Confirm your Delete Bin and reclaim gigabytes. Track your cleanup history over time.',
    bg: '#FEF3C7',
  },
];

type Slide = (typeof SLIDES)[0];

function SlideItem({ item }: { item: Slide }) {
  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
        <Text style={styles.slideIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideBody}>{item.body}</Text>
    </View>
  );
}

export function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<Slide>>(null);

  function handleViewableChange({ viewableItems }: { viewableItems: ViewToken[] }) {
    if (viewableItems[0]) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }

  function handleNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  }

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable style={styles.skipBtn} onPress={completeOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        <FlatList
          ref={flatRef}
          data={SLIDES}
          renderItem={({ item }) => <SlideItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableChange}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          scrollEventThrottle={16}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dot: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 120,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    width: 120,
  },
  nextBtn: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 14,
    ...theme.shadow.sm,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  safe: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  skipText: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  slide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  slideBody: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  slideIcon: {
    fontSize: 52,
  },
  slideTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});
