import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import ListScreen from './index';
import SavedScreen from './saved';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
          borderTopWidth: 1,
        },
      }}>
      <Tab.Screen
        name="index"
        component={ListScreen}
        options={{
          title: 'Liste',
          tabBarLabel: 'Liste',
        }}
      />
      <Tab.Screen
        name="saved"
        component={SavedScreen}
        options={{
          title: 'Kaydedilenler',
          tabBarLabel: 'Kaydedilenler',
        }}
      />
    </Tab.Navigator>
  );
}
