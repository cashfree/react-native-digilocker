export interface DigiLockerConfig {
  url: string;
  redirectUrl?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface DigiLockerResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DigiLockerModalProps {
  config: DigiLockerConfig;
  visible: boolean;
  onResult: (result: DigiLockerResult) => void;
  onCancel: () => void;
}
