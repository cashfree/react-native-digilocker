import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import {
  useDigiLocker,
  DigiLockerProvider,
} from '@cashfreepayments/react-native-digilocker';

// Example URL - replace with your actual DigiLocker URL
const digiLockerUrl =
  'https://verification.cashfree.com/dgl?shortCode=d345um5sa1hg';

function AppContent() {
  const { verify } = useDigiLocker();

  const handleVerifyDigiLocker = () => {
    verify(
      digiLockerUrl, // The URL to load in WebView
      'https://verification.cashfree.com/dgl/status',
      {
        userFlow: 'signin',
        onSuccess: (data: any) => {
          Alert.alert(
            'Success',
            `Verification successful: ${JSON.stringify(data)}`
          );
        },
        onError: (error: string) => {
          Alert.alert('Error', `Verification failed: ${error}`);
        },
        onCancel: () => {
          Alert.alert('Cancelled', 'Verification was cancelled');
        },
      }
    );
  };

  const handleVerifyWithDefaultRedirect = () => {
    verify(digiLockerUrl, undefined, {
      userFlow: 'signin',
      onSuccess: (data: any) => {
        Alert.alert(
          'Success',
          `Verification completed: ${JSON.stringify(data)}`
        );
      },
      onError: (error: string) => {
        Alert.alert('Error', error);
      },
      onCancel: () => {
        Alert.alert('Cancelled', 'User cancelled verification');
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CFDigiLocker SDK Example</Text>
      <Text style={styles.description}>
        This example demonstrates how to use the CFDigiLocker SDK to load URLs
        in a WebView and handle redirections.
      </Text>

      <Button
        title="Verify with Custom Redirect"
        onPress={handleVerifyDigiLocker}
      />

      <View style={styles.spacer} />

      <Button
        title="Verify with Default Redirect"
        onPress={handleVerifyWithDefaultRedirect}
      />

      {/* Modal is now automatically managed by DigiLockerProvider */}
    </View>
  );
}

export default function App() {
  return (
    <DigiLockerProvider>
      <AppContent />
    </DigiLockerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  spacer: {
    height: 20,
  },
});
