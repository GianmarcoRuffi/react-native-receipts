import { useCameraPermissions } from 'expo-camera';
import { Linking } from 'react-native';

export type CameraAccessStatus = 'undetermined' | 'granted' | 'denied';

export function useCameraAccess() {
  const [permission, requestPermission] = useCameraPermissions();
  const status: CameraAccessStatus = permission?.granted
    ? 'granted'
    : permission?.canAskAgain === false
      ? 'denied'
      : 'undetermined';

  return {
    status,
    requestPermission,
    openSettings: () => Linking.openSettings(),
  };
}