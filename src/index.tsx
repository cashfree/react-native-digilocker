import React, { useState, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type {
  DigiLockerConfig,
  DigiLockerResult,
  DigiLockerModalProps,
} from './types';

// Default listener URLs for environments
const PROD_LISTENER_URL = 'https://verification.cashfree.com/dgl/status';
const SBOX_LISTENER_URL = 'https://verification-test.cashfree.com/dgl/status';

// Helper to get listener URL based on DigiLocker URL domain
function getListenerUrlFromUrl(url: string) {
  if (url.includes('verification-test.cashfree.com')) return SBOX_LISTENER_URL;
  return PROD_LISTENER_URL;
}

// Global context for managing the modal
interface DigiLockerContextType {
  showModal: (config: DigiLockerConfig) => void;
  hideModal: () => void;
}

const DigiLockerContext = createContext<DigiLockerContextType | null>(null);

// Provider component that manages the modal globally
export function DigiLockerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<DigiLockerConfig | null>(null);

  const showModal = (modalConfig: DigiLockerConfig) => {
    setConfig(modalConfig);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const handleResult = (result: DigiLockerResult) => {
    setIsVisible(false);

    if (result.success) {
      config?.onSuccess?.(result.data);
    } else {
      config?.onError?.(result.error || 'Unknown error');
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    config?.onCancel?.();
  };

  return (
    <DigiLockerContext.Provider value={{ showModal, hideModal }}>
      {children}
      {config && (
        <DigiLockerModalComponent
          key={`${config.url}-${Date.now()}`}
          config={config}
          visible={isVisible}
          onResult={handleResult}
          onCancel={handleCancel}
        />
      )}
    </DigiLockerContext.Provider>
  );
}

// Hook for using DigiLocker verification - only exports verify function
export function useDigiLocker() {
  const context = useContext(DigiLockerContext);

  /**
   * @param url DigiLocker URL to load
   * @param redirectUrl Optional custom redirect URL
   * @param options DigiLockerConfig options
   *        Listener URL is auto-detected from the DigiLocker URL domain
   */
  const verify = (
    url: string,
    redirectUrl?: string,
    options?: Partial<DigiLockerConfig>
  ) => {
    const listenerUrl = getListenerUrlFromUrl(url);
    const fullConfig: DigiLockerConfig = {
      url,
      redirectUrl: redirectUrl || listenerUrl,
      ...options,
    };

    if (context) {
      context.showModal(fullConfig);
    } else {
      // Fallback: create a temporary modal if no provider is found
      console.warn(
        'DigiLockerProvider not found. Please wrap your app with DigiLockerProvider.'
      );
    }
  };

  return { verify };
}

function DigiLockerModalComponent({
  config,
  visible,
  onResult,
  onCancel,
}: DigiLockerModalProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const signInflow = config.userFlow === 'signin';

  const getDigiLockerScript = () => {
    return `
      if (window.location.href.includes('digilocker.meripehchaan.gov.in')) {
        function execute() {
            document.getElementById('otherbtn').click()
            document.getElementById('dropdownmenu').value='Aadhar'
            document.getElementById('terms3').checked = true
            document.getElementById('submitbtn3').disabled = false
        }
        execute();
      }
      true;
    `;
  };

  const defaultRedirectUrl = PROD_LISTENER_URL;

  const onNavigationStateChange = (navState: any) => {
    if (navState.url.includes(config.redirectUrl || defaultRedirectUrl)) {
      setTimeout(() => {
        onResult({
          success: true,
          data: { redirectUrl: navState.url },
        });
      }, 1000);
    }
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text>Loading...</Text>
            </View>
          )}

          <WebView
            source={{ uri: config.url }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            onNavigationStateChange={onNavigationStateChange}
            injectedJavaScript={signInflow ? getDigiLockerScript() : undefined}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    minHeight: 56,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    flexDirection: 'row',
  },
  backArrow: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    textAlignVertical: 'center',
    lineHeight: 20,
    includeFontPadding: false,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    textAlignVertical: 'center',
    lineHeight: 20,
    includeFontPadding: false,
    paddingLeft: 4,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 60,
    minHeight: 40,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    flexDirection: 'row',
  },
});

export type { DigiLockerConfig, DigiLockerResult } from './types';
