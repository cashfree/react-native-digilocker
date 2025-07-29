# React Native DigiLocker Verification

A React Native SDK for integrating DigiLocker verification flows into your mobile applications. This SDK provides a simple WebView-based solution for handling DigiLocker verification workflows with customizable callbacks and redirect handling.

## Features

- ✅ Easy integration with React Native apps
- ✅ WebView-based DigiLocker verification flow
- ✅ Customizable redirect URL handling
- ✅ TypeScript support
- ✅ React hooks-based API
- ✅ Loading states and error handling
- ✅ Automatic modal management
- ✅ Provider-based architecture for clean integration

## Installation

```bash
npm install @cashfreepayments/react-native-digilocker react-native-webview
```

or

```bash
yarn add @cashfreepayments/react-native-digilocker react-native-webview
```

### iOS Setup

For iOS, you need to install pods:

```bash
cd ios && pod install
```

### Android Setup

No additional setup required for Android.

## Running the Example App

The repository includes a complete example app that demonstrates how to use the DigiLocker SDK. To run the example:

### Prerequisites

Make sure you have the following installed:
- Node.js (>= 16)
- React Native development environment set up
- iOS Simulator (for iOS) or Android emulator/device (for Android)
- Yarn package manager

### Steps to Run

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/cashfree/react-native-digilocker.git
   cd react-native-digilocker
   yarn install
   ```

2. **Navigate to the example directory**:
   ```bash
   cd example
   ```

3. **For iOS**:
   ```bash
   # Install iOS dependencies
   cd ios && pod install && cd ..
   
   # Start Metro bundler
   yarn start
   
   # In a new terminal, run iOS app
   yarn ios
   ```

4. **For Android**:
   ```bash
   # Start Metro bundler
   yarn start
   
   # In a new terminal, run Android app
   yarn android
   ```

### Example App Features

The example app demonstrates:
- Basic DigiLocker verification flow with custom redirect URL
- Verification flow with default redirect URL
- User flow configuration (signin/signup)
- Success, error, and cancel callback handling
- Custom styling and UI integration
- Loading states and user feedback

### Customizing the Example

You can modify the example app by:
1. Updating the DigiLocker URL in `example/src/App.tsx`
2. Changing the `userFlow` parameter ('signin' or 'signup')
3. Customizing the UI and styling
4. Adding additional callback handling logic

## Usage

### Quick Start

1. **Wrap your app with DigiLockerProvider**
2. **Use the `verify` function to start verification**
3. **That's it! The modal is managed automatically**

```tsx
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useDigiLocker, DigiLockerProvider } from '@cashfreepayments/react-native-digilocker';

function AppContent() {
  const { verify } = useDigiLocker();

  const handleVerify = () => {
    verify(
      'https://verification.cashfree.com/dgl?shortCode=z345md9dg1hg',
      'https://verification.cashfree.com/dgl/status', // Optional redirect URL
      {
        userFlow: 'signin',
        onSuccess: (data) => {
          Alert.alert('Success', `Verification successful: ${JSON.stringify(data)}`);
        },
        onError: (error) => {
          Alert.alert('Error', `Verification failed: ${error}`);
        },
        onCancel: () => {
          Alert.alert('Cancelled', 'Verification was cancelled');
        },
      }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Verify with DigiLocker" onPress={handleVerify} />
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
```

### Advanced Usage

```tsx
import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { useDigiLocker, DigiLockerProvider } from '@cashfreepayments/react-native-digilocker';

function VerificationScreen() {
  const { verify } = useDigiLocker();

  const handleCustomVerification = () => {
    verify(
      'https://verification.cashfree.com/dgl?shortCode=z345md9dg1hg',
      'https://verification.cashfree.com/dgl/status', // Custom redirect URL
      {
        userFlow: 'signin',
        onSuccess: (data) => {
          // Handle successful verification
          console.log('Verification data:', data);
          Alert.alert('Success', 'Document verified successfully!');
        },
        onError: (error) => {
          // Handle verification error
          console.error('Verification error:', error);
          Alert.alert('Error', `Verification failed: ${error}`);
        },
        onCancel: () => {
          // Handle user cancellation
          console.log('User cancelled verification');
          Alert.alert('Cancelled', 'Verification was cancelled by user');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Start Verification"
        onPress={handleCustomVerification}
      />
    </View>
  );
}

function App() {
  return (
    <DigiLockerProvider>
      <VerificationScreen />
    </DigiLockerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
```

## API Reference

### DigiLockerProvider

A context provider that manages the DigiLocker modal globally. **Must wrap your app or the components that use DigiLocker**.

```tsx
import { DigiLockerProvider } from '@cashfreepayments/react-native-digilocker';

function App() {
  return (
    <DigiLockerProvider>
      {/* Your app content */}
    </DigiLockerProvider>
  );
}
```

### useDigiLocker Hook

The main hook for DigiLocker integration. **Must be used inside DigiLockerProvider**.

#### Returns

- `verify(url, redirectUrl?, options?)` - Function to start verification

#### Parameters

```tsx
verify(
  url: string,                    // DigiLocker URL to load
  redirectUrl?: string,           // Optional redirect URL (default: 'https://verification.cashfree.com/dgl/status')
  options?: {
    userFlow?: 'signin' | 'signup';      // Optional user flow type (restricted to 'signin' or 'signup')
    onSuccess?: (data: any) => void;     // Success callback
    onError?: (error: string) => void;   // Error callback
    onCancel?: () => void;               // Cancel callback
  }
)
```

### Types

```tsx
export interface DigiLockerConfig {
  url: string;
  redirectUrl?: string;
  userFlow?: 'signin' | 'signup';  // Restricted to only 'signin' or 'signup'
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface DigiLockerResult {
  success: boolean;
  data?: any;
  error?: string;
}
```

## Integration Steps

1. **Install the package and dependencies**
2. **Wrap your app with DigiLockerProvider**
3. **Use useDigiLocker hook in components that need verification**
4. **Call verify() with your DigiLocker URL and callbacks**

## Configuration

### Default Redirect URL

The SDK uses `https://verification.cashfree.com/dgl/status` as the default redirect URL. When the WebView navigates to a URL containing this pattern, the verification is considered complete.

### User Flow Configuration

The `userFlow` parameter accepts only two values:
- **`'signin'`** - For existing user authentication flows
- **`'signup'`** - For new user registration flows


### Modal Behavior

The SDK automatically manages the modal:
- Covers the full screen with slide animation
- Shows loading indicator during page loads
- Handles navigation state changes automatically
- Closes on successful verification or user cancellation

## Error Handling

The SDK handles various error scenarios:

1. **Network Errors**: When the WebView fails to load the URL
2. **Navigation Errors**: When there are issues with page navigation
3. **User Cancellation**: When the user dismisses the modal
4. **Provider Missing**: When useDigiLocker is used outside DigiLockerProvider

```tsx
const { verify } = useDigiLocker();

verify(url, redirectUrl, {
  onError: (error) => {
    switch (error) {
      case 'Network Error':
        // Handle network issues
        break;
      case 'User Cancelled':
        // Handle user cancellation
        break;
      default:
        // Handle other errors
        break;
    }
  }
});
```

## Best Practices

1. **Always wrap with Provider**: Ensure `DigiLockerProvider` wraps components using `useDigiLocker`
2. **Handle all callbacks**: Implement `onSuccess`, `onError`, and `onCancel` for better user experience
3. **Use correct userFlow**: Only use `'signin'` or `'signup'` for the `userFlow` parameter
4. **Test with real URLs**: Use actual DigiLocker URLs for testing
5. **Error messaging**: Provide clear error messages to users
6. **Network handling**: Consider offline scenarios and network timeouts

## Troubleshooting

### Common Issues

1. **"DigiLockerProvider not found" warning**: Ensure `useDigiLocker` is used inside `DigiLockerProvider`
2. **WebView not loading**: Ensure `react-native-webview` is properly installed and linked
3. **iOS build issues**: Run `pod install` in the iOS directory
4. **Android issues**: Ensure you have the latest version of react-native-webview

### Debug Mode

Enable debug mode in development:

```tsx
// Add console logs to track verification flow
verify(url, redirectUrl, {
  onSuccess: (data) => {
    console.log('DigiLocker Success:', data);
    // Your success handling
  },
  onError: (error) => {
    console.log('DigiLocker Error:', error);
    // Your error handling
  }
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Support

For support and questions, please create an issue on the [GitHub repository](https://github.com/cashfree/react-native-digilocker).
