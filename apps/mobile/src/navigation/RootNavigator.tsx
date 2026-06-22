import { Modal, StyleSheet, View } from 'react-native';

import { TabBar } from '../components/TabBar';
import { useApp } from '../context/AppContext';
import { AuthScreen } from '../screens/AuthScreen';
import { CleanupSuccessScreen } from '../screens/CleanupSuccessScreen';
import { DeleteBinScreen } from '../screens/DeleteBinScreen';
import { DeletionSuccessScreen } from '../screens/DeletionSuccessScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeDashboard } from '../screens/HomeDashboard';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PermissionScreen } from '../screens/PermissionScreen';
import { PremiumPaywallScreen } from '../screens/PremiumPaywallScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SmartCleanupScreen } from '../screens/SmartCleanupScreen';
import { SwipeScreen } from '../screens/SwipeScreen';

function AuthFlow() {
  const { flowScreen } = useApp();
  if (flowScreen === 'auth') return <AuthScreen />;
  if (flowScreen === 'onboarding') return <OnboardingScreen />;
  if (flowScreen === 'permission') return <PermissionScreen />;
  return null;
}

function ActiveTab() {
  const { activeTab } = useApp();
  switch (activeTab) {
    case 'home': return <HomeDashboard />;
    case 'swipe': return <SwipeScreen />;
    case 'delete-bin': return <DeleteBinScreen />;
    case 'history': return <HistoryScreen />;
    case 'settings': return <SettingsScreen />;
  }
}

function ModalScreen() {
  const { modal, closeModal } = useApp();

  const content = (() => {
    switch (modal) {
      case 'cleanup-success': return <CleanupSuccessScreen />;
      case 'deletion-success': return <DeletionSuccessScreen />;
      case 'smart-cleanup': return <SmartCleanupScreen />;
      case 'premium': return <PremiumPaywallScreen />;
      default: return null;
    }
  })();

  return (
    <Modal
      visible={modal !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      {content}
    </Modal>
  );
}

export function RootNavigator() {
  const { flowScreen } = useApp();

  if (flowScreen !== null) {
    return (
      <View style={styles.fill}>
        <AuthFlow />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <View style={styles.content}>
        <ActiveTab />
      </View>
      <TabBar />
      <ModalScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
