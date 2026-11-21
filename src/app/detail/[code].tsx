import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Detay: {code}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
