import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { VStack } from 'native-base';
import { ConnectionData, StatusCard, TrafficData } from '../componets/StatusCard';

// Todo: change the color of the lineChart. Make the transition of each second more smooth
export default function StatusScreen({ route }:{route:any}) {
    const { url, auth } = route.params;
    const [trafficData, setTrafficData] = useState({} as TrafficData);
    const [connectionData, setConnectionData] = useState({} as ConnectionData);
    useEffect(() => {
        const ws = new WebSocket(`${url}/traffic?token=${auth}`);
        ws.onmessage = ((e) => {
            setTrafficData(JSON.parse(e.data));
        });
        return () => ws.close();
    }, []);

    useEffect(() => {
        const ws = new WebSocket(`${url}/connections?token=${auth}`);
        ws.onmessage = ((e) => {
            setConnectionData(JSON.parse(e.data));
        });
        return () => ws.close();
    }, []);
    return (
        <View>
            <VStack>
                <StatusCard
                    trafficData={trafficData.down}
                    connectionData={connectionData.downloadTotal}
                    status="down"
                />
                <StatusCard
                    trafficData={trafficData.up}
                    connectionData={connectionData.uploadTotal}
                    status="up"
                />
            </VStack>
        </View>
    );
}
