import { StyleSheet, FlatList, SafeAreaView, Pressable, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useSavedRates } from '@/hooks/useSavedRates';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export default function SavedScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { savedRates, refetch } = useSavedRates();

  // Sekmeye her gelindiğinde kayıtları AsyncStorage'dan yeniden oku
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={savedRates}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<ThemedText type="title" style={styles.title}>Kaydedilenler</ThemedText>}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/detail/[code]' as any, params: { code: item.code } })}>
            <View style={[styles.savedItem, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.savedCode}>{item.code}</ThemedText>
              <ThemedText style={{ color: theme.accent, fontWeight: '600' }}>1 GBP = {item.rate.toFixed(2)}</ThemedText>
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
  title: { paddingTop: 16, paddingBottom: 12 },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  savedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  savedCode: { fontWeight: '700', fontSize: 18 },
});
