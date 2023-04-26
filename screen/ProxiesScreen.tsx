import { View } from 'react-native';
import { Text, useToast } from 'native-base';
import wretch from 'wretch';
import { useEffect, useState } from 'react';

export default function ProxiesScreen({ route }:{route:any}) {
    const { url, auth } = route.params;
    const fetchProxiesData = wretch(`${url}/proxies`).auth(`Bearer ${auth}`);
    const [proxiesData, setProxiesData] = useState({});
    const toast = useToast();
    useEffect(() => {
        const fetchProxies = async () => {
            const resp = await fetchProxiesData.get().json();
            setProxiesData(resp);
        };
        fetchProxies().catch(() => {
            toast.show({
                title: 'Network Error',
                placement: 'top',
            });
        });
    }, []);
    return (
        <View>
            <Text>Proxies Screen</Text>
        </View>
    );
}
