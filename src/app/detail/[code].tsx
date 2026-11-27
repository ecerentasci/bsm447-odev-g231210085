import { StyleSheet, SafeAreaView, ScrollView, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { useSavedRates } from '@/hooks/useSavedRates';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Detayda gösterilecek GBP miktarları
const AMOUNTS = [1, 10, 100, 1000];

export default function DetailScreen() {
  const router = useRouter();
  const theme = useTheme();
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

  const card = { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={[styles.backButton, { color: theme.accent }]}>← Geri</ThemedText>
        </Pressable>

        <ThemedText type="title" style={styles.title}>{code}</ThemedText>

        {/* Düz kur, ters kur ve kurun tarihi */}
        <View style={[styles.card, card]}>
          <ThemedText style={[styles.rateValue, { color: theme.accent }]}>
            1 GBP = {rate.rate.toFixed(4)} {code}
          </ThemedText>
          <ThemedText style={styles.inverseValue}>
            1 {code} = {(1 / rate.rate).toFixed(4)} GBP
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 6 }}>
            Kur tarihi: {date}
          </ThemedText>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Dönüşümler</ThemedText>
        <View style={[styles.card, card]}>
          {AMOUNTS.map((amount, i) => (
            <View
              key={amount}
              style={[styles.conversionItem, i > 0 && { borderTopWidth: 1, borderTopColor: theme.backgroundSelected }]}>
              <ThemedText style={{ color: theme.textSecondary }}>{amount} GBP</ThemedText>
              <ThemedText style={styles.conversionValue}>{(amount * rate.rate).toFixed(2)} {code}</ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          style={[
            styles.button,
            isSavedFlag
              ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.accent }
              : { backgroundColor: theme.accent },
          ]}
          onPress={handleToggleSave}>
          <ThemedText style={[styles.buttonText, { color: isSavedFlag ? theme.accent : theme.onAccent }]}>
            {isSavedFlag ? 'Kaydedilenlerden Çıkar' : 'Kaydet'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  backButton: { marginBottom: 12, fontSize: 16, fontWeight: '600' },
  title: { marginBottom: 16, fontSize: 32 },
  card: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 20 },
  rateValue: { fontSize: 22, fontWeight: '700' },
  inverseValue: { fontSize: 16, marginTop: 4 },
  sectionTitle: { marginBottom: 10 },
  conversionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  conversionValue: { fontWeight: '700' },
  button: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { fontWeight: '700', fontSize: 16 },
});
