import { StyleSheet, FlatList, ActivityIndicator, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Rate } from '@/types';

export default function ListScreen() {
  const router = useRouter();
  const { rates, loading, error } = useCurrencyRates();

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Hata: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rates}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/detail/${item.code}`)}>
            <ThemedView style={styles.rateItem}>
              <ThemedText type="default">{item.code}</ThemedText>
              <ThemedText type="default">{item.rate.toFixed(2)}</ThemedText>
            </ThemedView>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff3333',
  },
});
