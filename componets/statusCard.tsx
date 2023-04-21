import {
    Box, HStack, Stack, Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useEffect, useState } from 'react';

export interface TrafficData {
    up: number;
    down: number;
}

export interface ConnectionData {
    connections: connectionItem[],
    downloadTotal: number,
    uploadTotal: number
}

export interface connectionItem {
    download: number,
    upload: number,
    id: string,
    rule: string,
    rulePayload: string,
    start: string,
    metadata: {
        destinationIP: string,
        destinationPort: string,
        dnsMode: string,
        host: string,
        network: string,
        processPath: string,
        sourceIP: string,
        sourcePort: string,
        specialProxy: string,
        type: string,
    },
    chain: {
        0: string,
        1: string,
    }[]

}

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function convertToNetworkSpeed(number: number) {
    let n = 0;
    if (number) {
        n = number;
    }
    if (n < 1000) {
        return `${n} B`;
    }
    const exponent = Math.min(Math.floor(Math.log10(n) / 3), UNITS.length - 1);
    n = Number((n / 1000 ** exponent).toPrecision(3));
    const unit = UNITS[exponent];
    return `${n} ${unit}`;
}

export function StatusCard(
    {
        trafficData,
        status,
        connectionData,
    }:
        { trafficData: number, status: string, connectionData: number },
) {
    const [lineData, setLineData] = useState(Array(30)
        .fill(0));
    useEffect(() => {
        if (trafficData) {
            if (lineData.length === 30) {
                setLineData((prevState) => {
                    const newData = prevState.slice(1);
                    newData.push(trafficData);
                    return newData;
                });
            } else {
                setLineData((prevState) => [...prevState, trafficData]);
            }
        }
    }, [trafficData]);
    return (
        <Box bg="muted.50" rounded="lg" shadow={3} margin={2}>
            <Box padding={5}>
                <HStack justifyContent="space-between">
                    <Stack direction="row" space={2}>
                        <Ionicons
                            name={status === 'down' ? 'ios-cloud-download-outline' : 'ios-cloud-upload-outline'}
                            size={24}
                            color="black"
                        />
                        <Text>{status === 'down' ? 'Download' : 'Upload'}</Text>
                    </Stack>
                    <Text>
                        {convertToNetworkSpeed(trafficData)}
                        /s
                    </Text>
                </HStack>
            </Box>
            <Box>
                <LineChart
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'visible',
                    }}
                    data={{
                        labels: [],
                        datasets: [
                            {
                                data: lineData,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width * 0.9} // from react-native
                    height={Dimensions.get('window').height * 0.26}
                    withDots={false}
                    withVerticalLines={false}
                    withVerticalLabels={false}
                    chartConfig={{
                        backgroundColor: '#fafafa',
                        backgroundGradientFrom: '#fafafa',
                        backgroundGradientTo: '#fafafa',
                        color: (opacity = 1) => (status === 'down' ? `rgba(0, 0, 0, ${opacity})` : `rgba(0, 0, 0, ${opacity})`),
                        decimalPlaces: 0,
                        propsForLabels: {
                            fontSize: 10,
                        },
                    }}
                    fromZero
                    formatYLabel={(yValue) => `${convertToNetworkSpeed(Number(yValue))}/s`}
                    bezier
                />
            </Box>
            <Box pr={5} pl={5} pb={3}>
                <HStack justifyContent="space-between">
                    <Text>
                        Total
                        {' '}
                        {status === 'down' ? 'Download' : 'Upload'}
                    </Text>
                    <Text>
                        {convertToNetworkSpeed(connectionData)}
                    </Text>
                </HStack>
            </Box>
        </Box>
    );
}
