import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';
import { StatusScreen } from './component/StatusScreen';
import Setting from './component/SettingScreen';

const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, size, color }) => {
        let iconName;
        switch (route.name) {
        case 'Status':
            iconName = focused ? 'ios-bar-chart' : 'ios-bar-chart-outline';
            break;
        case 'Setting':
            iconName = focused ? 'ios-settings' : 'ios-settings-outline';
            break;
        default:
            iconName = 'error';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
    },
});

const Tab = createBottomTabNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <NativeBaseProvider>
                <Tab.Navigator screenOptions={screenOptions}>
                    <Tab.Screen name="Status" component={StatusScreen} />
                    <Tab.Screen name="Setting" component={Setting} />
                </Tab.Navigator>
            </NativeBaseProvider>
        </NavigationContainer>

    );
}