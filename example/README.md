# CF DigiLocker SDK Example App

This example app demonstrates how to integrate and use the CF DigiLocker SDK in a React Native application.

## Features Demonstrated

- Basic DigiLocker verification flow with custom redirect URL
- Verification flow with default redirect URL  
- User flow configuration with type-safe 'signin' and 'signup' options
- Success, error, and cancellation callbacks
- Loading states and user feedback
- Provider-based architecture

## Running the Example

1. Install dependencies:
   ```bash
   cd example
   yarn install
   ```

2. For iOS:
   ```bash
   cd ios && pod install && cd ..
   yarn ios
   ```

3. For Android:
   ```bash
   yarn android
   ```

## Code Structure

### App.tsx

The main application file demonstrates:

1. **Import the SDK**:
   ```tsx
   import { useDigiLocker, DigiLockerProvider } from '@cashfreepayments/react-native-digilocker';
   ```

2. **Wrap with Provider**:
   ```tsx
   export default function App() {
     return (
       <DigiLockerProvider>
         <AppContent />
       </DigiLockerProvider>
     );
   }
   ```

3. **Initialize the hook**:
   ```tsx
   const { verify } = useDigiLocker();
   ```

4. **Start verification**:
   ```tsx
   verify(
     'https://verification.cashfree.com/dgl?shortCode=z345md9dg1hg',
     'https://verification.cashfree.com/dgl/status',
     {
       userFlow: 'signin', // Type-safe: only 'signin' or 'signup' allowed
       onSuccess: (data) => { /* Handle success */ },
       onError: (error) => { /* Handle error */ },
       onCancel: () => { /* Handle cancellation */ }
     }
   );
   ```

## Modal Management

The SDK automatically manages the modal through the `DigiLockerProvider`. No need to manually render modal components - just call `verify()` and the modal will appear automatically.

## Example URLs

The example uses test URLs for demonstration:
- **DigiLocker URL**: `https://verification.cashfree.com/dgl?shortCode=z345md9dg1hg`
- **Redirect URL**: `https://verification.cashfree.com/dgl/status`

Replace these with your actual DigiLocker URLs in production.

## Testing

1. **Test Success Flow**: Complete the verification process to see success callback
2. **Test Cancellation**: Close the modal to see cancel callback  
3. **Test Error Handling**: Use invalid URLs to see error callback
4. **Test User Flow Types**: Try both 'signin' and 'signup' userFlow options (TypeScript will enforce correct values)
5. **Test Default Redirect**: Use the "Verify with Default Redirect" button to test without custom redirect URL

## Customization

You can customize:
- Button titles and styling
- Alert messages and user feedback
- userFlow parameter (restricted to 'signin' or 'signup' only)
- Redirect URLs for different verification flows
- Loading indicators and modal appearance

## Production Usage

When integrating into your production app:

1. Replace test URLs with your actual DigiLocker URLs
2. Configure appropriate userFlow ('signin' or 'signup') based on your use case - TypeScript will prevent invalid values
3. Implement proper error handling and user feedback
4. Add proper loading states and network connectivity handling
5. Test thoroughly on both iOS and Android platforms
6. Ensure DigiLockerProvider wraps all components using the SDK
7. Handle edge cases like app backgrounding during verification
8. Leverage TypeScript's type safety for userFlow to prevent runtime errors
