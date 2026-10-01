import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet } from 'react-native';

import { receiptText } from '@/src/constants/strings';

export default function ReceiptViewScreen() {
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={receiptText.closePreview} onPress={() => router.back()} style={styles.screen}>
      {uri ? <Image accessibilityLabel={receiptText.receiptImage} resizeMode="contain" source={{ uri }} style={styles.image} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', backgroundColor: '#000', flex: 1, justifyContent: 'center' },
  image: { height: '100%', width: '100%' },
});