# CF DigiLocker SDK Example App

This2. **Import the SDK**:
   ```tsx
   import { useDigiLocker } from '@cashfreepayments/react-native-digilocker';
   ```mple app demonstrates how to integrate and use the CF DigiLocker SDK in a React Native application.

## Features Demonstrated

- Basic DigiLocker verification flow
- Custom redirect URL handling
- Default redirect URL usage
- Success, error, and cancellation callbacks
- Loading states and user feedback

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
   import { useDigiLocker } from 'react-native-cfdigilocker';
   ```

2. **Initialize the hook**:
   ```tsx
   const { verify, DigiLockerModal } = useDigiLocker();
   ```

3. **Start verification**:
   ```tsx
   verify(
     'https://verification.cashfree.com/dgl?shortCode=t340bg94ii8g',
     'https://verification.cashfree.com/dgl/status',
     {
       onSuccess: (data) => { /* Handle success */ },
       onError: (error) => { /* Handle error */ },
       onCancel: () => { /* Handle cancellation */ }
     }
   );
   ```

4. **Render the modal**:
   ```tsx
   {DigiLockerModal}
   ```

## Example URLs

The example uses test URLs for demonstration:
- **DigiLocker URL**: `https://verification.cashfree.com/dgl?shortCode=t340bg94ii8g`
- **Redirect URL**: `https://verification.cashfree.com/dgl/status`

Replace these with your actual DigiLocker URLs in production.

## Testing

1. **Test Success Flow**: Complete the verification process to see success callback
2. **Test Cancellation**: Close the modal to see cancel callback  
3. **Test Error Handling**: Use invalid URLs to see error callback

## Customization

You can customize:
- Button titles and styling
- Alert messages
- Loading indicators
- Modal appearance (by modifying the SDK)

## Production Usage

When integrating into your production app:

1. Replace test URLs with your actual DigiLocker URLs
2. Implement proper error handling and user feedback
3. Add proper loading states
4. Handle network connectivity issues
5. Test thoroughly on both platforms
