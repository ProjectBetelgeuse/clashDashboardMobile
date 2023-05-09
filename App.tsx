import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
    Button, Center, Flex, NativeBaseProvider, PresenceTransition, Text, useToast,
} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import wretch from 'wretch';
import AbortAddon from 'wretch/dist/addons/abort';
import StatusScreen from './screen/StatusScreen';
import Setting from './screen/SettingScreen';
import ProxiesScreen from './screen/ProxiesScreen';
import RuleScreen from './screen/RuleScreen';
import ConnectionScreen from './screen/ConnectionScreen';
import BackendForm from './screen/BackendForm';

interface ConnectionInfo {
    url:string,
    auth:string
}
// const connectionURL = {
//     url: 'http://192.168.100.1:9090',
//     auth: '123456',
// };
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
    const [isURLExist, setIsURLExist] = useState(false);
    const [connectionInfo, setConnectionInfo] = useState({} as ConnectionInfo);
    const handleSubmit = (url, auth) => {
        setConnectionInfo({
            url,
            auth,
        });
        setIsURLExist(true);
    };

    const style = StyleSheet.create({
        transaction: {
            flex: 1,
        },
    });
    return (
        <NavigationContainer>
            <NativeBaseProvider>
                {isURLExist ? (
                    <PresenceTransition
                        visible={isURLExist}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            transition: {
                                duration: 1000,
                            },
                        }}
                        exit={{
                            opacity: 1,
                        }}
                        style={style.transaction}
                    >
                        <Tab.Navigator screenOptions={screenOptions}>
                            <Tab.Screen name="Status" component={StatusScreen} initialParams={connectionInfo} />
                            <Tab.Screen name="Proxies" component={ProxiesScreen} initialParams={connectionInfo} />
                            <Tab.Screen name="Rule" component={RuleScreen} initialParams={connectionInfo} />
                            <Tab.Screen name="Connection" component={ConnectionScreen} initialParams={connectionInfo} />
                            <Tab.Screen name="Setting" component={Setting} initialParams={connectionInfo} />
                        </Tab.Navigator>
                    </PresenceTransition>
                ) : (
                    <PresenceTransition
                        visible={!isURLExist}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            transition: {
                                duration: 1000,
                            },
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        style={style.transaction}
                    >
                        <BackendForm handleSubmit={handleSubmit} />
                    </PresenceTransition>
                )}
            </NativeBaseProvider>
        </NavigationContainer>
    );
}
