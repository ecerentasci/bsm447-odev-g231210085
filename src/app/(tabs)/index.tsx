import { StyleSheet, FlatList, ActivityIndicator, SafeAreaView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Rate } from '@/types';

export default function ListScreen() {
  const router = useRouter();
  const { rates, loading, error } = useCurrencyRates();
  const [searchText, setSearchText] = useState('');
  const [amount, setAmount] = useState('1');

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

  const filteredRates = rates.filter((rate) =>
    rate.code.toUpperCase().includes(searchText.toUpperCase())
  );

  const numAmount = parseFloat(amount) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredRates}
        keyExtractor={(item) => item.code}
        ListHeaderComponent={() => (
          <ThemedView style={styles.headerContainer}>
            <TextInput
              style={styles.input}
              placeholder="Para birimi ara (örn: USD)"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Miktar (varsayılan: 1)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </ThemedView>
        )}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/detail/[code]' as any, params: { code: item.code } })}>
            <ThemedView style={styles.rateItem}>
              <ThemedView style={styles.rateLeft}>
                <ThemedText type="default" style={styles.rateName}>
                  {item.code}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.rateRight}>
                <ThemedText type="small" style={styles.rateSmall}>
                  1 GBP = {item.rate.toFixed(2)}
                </ThemedText>
                <ThemedText type="default" style={styles.rateConverted}>
                  {numAmount} GBP = {(numAmount * item.rate).toFixed(2)}
                </ThemedText>
              </ThemedView>
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  rateLeft: {
    justifyContent: 'center',
  },
  rateRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rateName: {
    fontWeight: '600',
    fontSize: 16,
  },
  rateSmall: {
    color: '#666',
    marginBottom: 4,
  },
  rateConverted: {
    fontWeight: '500',
    color: '#007AFF',
  },
  errorText: {
    color: '#ff3333',
  },
});
