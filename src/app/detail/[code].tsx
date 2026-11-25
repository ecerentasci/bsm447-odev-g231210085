import { StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { useSavedRates } from '@/hooks/useSavedRates';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DetailScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const { rates, date } = useCurrencyRates();
  const { saveRate, removeRate, isSaved, savedRates } = useSavedRates();

  const rate = rates.find((r) => r.code === code);

  if (!rate) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Para birimi bulunamadı</ThemedText>
      </ThemedView>
    );
  }

  const isSavedFlag = isSaved(code!);
  const savedRateItem = savedRates.find((r) => r.code === code);

  const handleToggleSave = () => {
    if (isSavedFlag && savedRateItem) {
      removeRate(savedRateItem.id);
    } else {
      saveRate(code!, rate.rate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="subtitle" style={styles.backButton}>
            ← Geri
          </ThemedText>
        </Pressable>

        <ThemedText type="title" style={styles.title}>
          {code}
        </ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="default" style={styles.rateValue}>
            Kur: {rate.rate.toFixed(4)}
          </ThemedText>
          <ThemedText type="small" style={styles.dateText}>
            Tarih: {date}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Dönüşümler
          </ThemedText>
          <ThemedView style={styles.conversionItem}>
            <ThemedText>1 GBP =</ThemedText>
            <ThemedText>{(1 * rate.rate).toFixed(2)} {code}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.conversionItem}>
            <ThemedText>10 GBP =</ThemedText>
            <ThemedText>{(10 * rate.rate).toFixed(2)} {code}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.conversionItem}>
            <ThemedText>100 GBP =</ThemedText>
            <ThemedText>{(100 * rate.rate).toFixed(2)} {code}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.conversionItem}>
            <ThemedText>1000 GBP =</ThemedText>
            <ThemedText>{(1000 * rate.rate).toFixed(2)} {code}</ThemedText>
          </ThemedView>
        </ThemedView>

        <Pressable style={styles.button} onPress={handleToggleSave}>
          <ThemedText style={styles.buttonText}>
            {isSavedFlag ? 'Kaydedilenlerden Çıkar' : 'Kaydet'}
          </ThemedText>
        </Pressable>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 16,
    color: '#007AFF',
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  rateValue: {
    fontSize: 18,
    marginBottom: 8,
  },
  dateText: {
    color: '#666',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  conversionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
