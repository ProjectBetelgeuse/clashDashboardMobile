import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';
import StatusScreen from './screen/StatusScreen';
import Setting from './screen/SettingScreen';
import ProxiesScreen from './screen/ProxiesScreen';
import RuleScreen from './screen/RuleScreen';
import ConnectionScreen from './screen/ConnectionScreen';

const connectionURL = {
    url: 'http://192.168.100.1:9090',
    auth: '123456',
};
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
        case 'Proxies':
            iconName = focused ? 'ios-globe' : 'ios-globe-outline';
            break;
        case 'Rule':
            iconName = focused ? 'ios-file-tray-full' : 'ios-file-tray-full-outline';
            break;
        case 'Connection':
            iconName = focused ? 'ios-link' : 'ios-link-outline';
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
                    <Tab.Screen name="Status" component={StatusScreen} initialParams={connectionURL} />
                    <Tab.Screen name="Proxies" component={ProxiesScreen} initialParams={connectionURL} />
                    <Tab.Screen name="Rule" component={RuleScreen} initialParams={connectionURL} />
                    <Tab.Screen name="Connection" component={ConnectionScreen} initialParams={connectionURL} />
                    <Tab.Screen name="Setting" component={Setting} initialParams={connectionURL} />
                </Tab.Navigator>
            </NativeBaseProvider>
        </NavigationContainer>
    );
}
