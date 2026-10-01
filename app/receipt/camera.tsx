import { CameraView } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { receiptText } from '@/src/constants/strings';
import { theme } from '@/src/constants/theme';
import { copyReceiptToStorage } from '@/src/features/receipt/storage';
import { useCameraAccess } from '@/src/features/receipt/useCameraAccess';

export default function ReceiptCameraScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const cameraRef = useRef<CameraView>(null);
  const { status, requestPermission, openSettings } = useCameraAccess();
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(false);

  async function takePhoto(): Promise<void> {
    if (!cameraRef.current) return;
    setCapturing(true);
    setError(false);
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const receiptUri = await copyReceiptToStorage(picture.uri);
      router.replace({
        pathname: (returnTo || '/expense/new') as '/expense/new',
        params: { receiptUri },
      });
    } catch {
      setError(true);
      setCapturing(false);
    }
  }

  if (status === 'undetermined') {
    return (
      <PermissionState>
        <Text style={styles.title}>{receiptText.permissionTitle}</Text>
        <Text style={styles.message}>{receiptText.permissionMessage}</Text>
        <Button title={receiptText.allowCamera} onPress={requestPermission} />
        <Button title={receiptText.cancel} onPress={() => router.back()} variant="secondary" />
      </PermissionState>
    );
  }

  if (status === 'denied') {
    return (
      <PermissionState>
        <Text style={styles.title}>{receiptText.permissionTitle}</Text>
        <Text style={styles.message}>{receiptText.permissionMessage}</Text>
        <Button title={receiptText.openSettings} onPress={openSettings} />
        <Button title={receiptText.cancel} onPress={() => router.back()} variant="secondary" />
      </PermissionState>
    );
  }

  return (
    <View style={styles.screen}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.controls}>
        {error ? <Text style={styles.error}>{receiptText.captureError}</Text> : null}
        {capturing ? <ActivityIndicator color={theme.colors.primaryText} /> : null}
        <Pressable accessibilityRole="button" accessibilityLabel={receiptText.takePhoto} disabled={capturing} onPress={takePhoto} style={styles.shutter} />
        <Button title={receiptText.cancel} onPress={() => router.back()} variant="secondary" />
      </View>
    </View>
  );
}

function PermissionState({ children }: { children: React.ReactNode }) {
  return <View style={styles.permission}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#000', flex: 1 },
  camera: { flex: 1 },
  controls: { alignItems: 'center', backgroundColor: '#000', gap: theme.spacing.md, padding: theme.spacing.lg },
  shutter: { backgroundColor: '#FFFFFF', borderColor: theme.colors.primary, borderRadius: 40, borderWidth: 5, height: 72, width: 72 },
  permission: { alignItems: 'center', backgroundColor: theme.colors.background, flex: 1, gap: theme.spacing.md, justifyContent: 'center', padding: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  message: { color: theme.colors.muted, fontSize: 16, lineHeight: 23, textAlign: 'center' },
  error: { color: '#FFFFFF', fontSize: 14 },
});