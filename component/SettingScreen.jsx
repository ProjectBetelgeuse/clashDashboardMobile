import { StyleSheet, Text, View } from 'react-native';
import { SectionList } from 'native-base';

const sectionData = [
    {
        title: 'Ports',
        data: [
            { key: 'port', label: 'HTTP Proxy Port' },
            { key: 'redir-port', label: 'Redir Port' },
            { key: 'socks-port', label: 'Socks Port' },
            { key: 'tproxy-port', label: 'TPROXY Port' },
            { key: 'mixed-port', label: 'Mixed Port' },
        ],
    },
    {
        title: 'Mode',
        data: [
            { key: 'mode', label: 'Mode' },
        ],
    },
    {
        title: 'Log Level',
        data: [
            { key: 'logLevel', label: 'Log Level' },
        ],
    },
];

const itemBackgroundColor = '#FFF';
const borderBottomColor = '#f2f1f7';

const styles = StyleSheet.create({
    header: {
        marginVertical: 8,
    },
    item: {
        backgroundColor: itemBackgroundColor,
        borderBottomColor,
        borderBottomWidth: 1,
        padding: 10,
    },
    itemFirst: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    itemLast: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomWidth: 0,
    },
    sectionBetween: {
        height: 20,
    },
});

const item = ({ item, index, section }) => (
    <View
        style={[
            styles.item,
            index === 0 && styles.itemFirst,
            index === section.data.length - 1 && styles.itemLast,
        ]}
    >
        <Text>{item.label}</Text>
    </View>
);

function Setting() {
    return (
        <SectionList
            p="3"
            bg="#f2f1f7"

            sections={sectionData}
            renderItem={item}
            renderSectionHeader={({ section: { title } }) => (
                <View style={styles.header}>
                    <Text>{title}</Text>
                </View>
            )}
            renderSectionFooter={() => (
                <View style={styles.sectionBetween} />
            )}
        />
    );
}

export default Setting;
