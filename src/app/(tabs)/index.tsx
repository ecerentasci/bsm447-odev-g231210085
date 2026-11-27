import { StyleSheet, FlatList, ActivityIndicator, SafeAreaView, Pressable, TextInput, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { rates, loading, error } = useCurrencyRates();
  const [searchText, setSearchText] = useState('');
  const [amount, setAmount] = useState('1');

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.accent} />
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

  // Kutuların rengi temadan geliyor
  const inputStyle = [
    styles.input,
    { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected, color: theme.text },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredRates}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <TextInput
              style={inputStyle}
              placeholder="Para birimi ara (örn: USD)"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={theme.textSecondary}
            />
            <TextInput
              style={inputStyle}
              placeholder="Miktar (varsayılan: 1)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/detail/[code]' as any, params: { code: item.code } })}>
            <View style={[styles.rateItem, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.rateName}>{item.code}</ThemedText>
              <View style={styles.rateRight}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  1 GBP = {item.rate.toFixed(2)}
                </ThemedText>
                <ThemedText style={[styles.rateConverted, { color: theme.accent }]}>
                  {numAmount} GBP = {(numAmount * item.rate).toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { paddingTop: 12, paddingBottom: 16, gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  rateRight: { alignItems: 'flex-end' },
  rateName: { fontWeight: '700', fontSize: 18 },
  rateConverted: { fontWeight: '600', marginTop: 2 },
  errorText: { color: '#F87171' },
});
