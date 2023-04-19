import { StyleSheet, View } from 'react-native';
import {
    Box,
    Button,
    Flex,
    Pressable,
    SectionList,
    Text,
    Input,
    Modal,
    useToast,
    Switch,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import wretch from 'wretch';

interface SectionItem {
    key: string;
    label: string;
    value: boolean | number;
    action?: () => JSX.Element;
}
interface SectionItemData {
    title: string,
    category: string,
    pressable? : boolean;
    data: SectionItem[];
}

const sectionDataInit : SectionItemData[] = [
    {
        title: 'Ports',
        category: 'ports',
        pressable: true,
        data: [
            {
                key: 'port',
                label: 'HTTP Proxy Port',
                value: 0,
            },
            { key: 'redir-port', label: 'Redir Port', value: 0 },
            { key: 'socks-port', label: 'Socks Port', value: 0 },
            { key: 'tproxy-port', label: 'TPROXY Port', value: 0 },
            { key: 'mixed-port', label: 'Mixed Port', value: 0 },
        ],
    },
    {
        title: 'Mode',
        category: 'mode',
        pressable: true,
        data: [
            {
                key: 'rule', label: 'Rule', value: true,
            },
            { key: 'direct', label: 'Direct', value: false },
            { key: 'global', label: 'Global', value: false },
        ],
    },
    {
        title: 'Log Level',
        category: 'log-level',
        pressable: true,
        data: [
            { key: 'silent', label: 'Silent', value: true },
            { key: 'debug', label: 'Debug', value: false },
            { key: 'error', label: 'Error', value: false },
            { key: 'warn', label: 'Warning', value: false },
            { key: 'info', label: 'Info', value: false },
        ],
    },
    {
        title: 'Allow LAN',
        category: 'allow-lan',
        pressable: false,
        data: [
            { key: 'allow-lan', label: 'Allow LAN', value: true },
        ],
    },
];

const borderBottomColor = '#f2f1f7';
const bgDark = 'muted.50';
const bgPressed = 'muted.200';

const styles = StyleSheet.create({
    header: {
        marginVertical: 8,
    },
    item: {
        borderBottomColor,
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        padding: 15,
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

function Setting() {
    const url = 'http://192.168.100.1:9090';
    const auth = '123456';
    const [showModal, setShowModal] = useState(false);
    const [sectionData, setSectionData] = useState(sectionDataInit as SectionItemData[]);
    const [portChangeValue, setPortChangeValue] = useState('');
    const [clickedData, setClickedData] = useState({} as SectionItem);
    const portRef = useRef(null);
    const toast = useToast();

    const fetchConfigs = async () => {
        const configs = await wretch(`${url}/configs`).auth(`Bearer ${auth}`).get().json();
        const newSectionData = sectionData.map((section) => ({
            ...section,
            data: section.data.map((item) => {
                if (section.category === 'mode' || section.category === 'log-level') {
                    return {
                        ...item,
                        value: configs[section.category] === item.key,
                    };
                }
                return {
                    ...item,
                    value: configs[item.key],
                };
            }),
        }));
        setSectionData(newSectionData);
    };

    // initial load the data
    useEffect(() => {
        fetchConfigs().catch(() => {
            toast.show({
                title: 'Network Error',
                placement: 'top',
            });
        });
    }, []);

    const onItemPressed = async (item:SectionItem, index, section:SectionItemData) => {
        if (section.category === 'ports') {
            setShowModal(true);
            setClickedData(item);
        } else {
            await wretch(`${url}/configs`).auth(`Bearer ${auth}`).patch({ [section.category]: item.key });
            await fetchConfigs();
        }
    };

    const onToggleButton = async (status) => {
        await wretch(`${url}/configs`).auth(`Bearer ${auth}`).patch({ 'allow-lan': status });
        await fetchConfigs();
    };

    const handlePortChange = (value) => setPortChangeValue(value);
    const handlePortSave = async () => {
        await wretch(`${url}/configs`).auth(`Bearer ${auth}`).patch({ [clickedData.key]: Number(portChangeValue) });
        // setSectionData(sectionData.map((section) => ({
        //     ...section,
        //     data: section.data.map((item) => {
        //         if (clickedData.key === item.key) {
        //             return {
        //                 ...item,
        //                 value: Number(portChangeValue),
        //             };
        //         }
        //         return {
        //             ...item,
        //         };
        //     }),
        // })));
        setPortChangeValue('');
        setShowModal(false);
        await fetchConfigs();
    };

    // render each buttons in the setting menus
    const renderItem = (
        { item, index, section }:
        {item:SectionItem, index: number, section:SectionItemData},
    ) => {
        let content;
        if (section.category === 'ports') {
            content = (
                <Box flexDirection="row" alignItems="center">
                    <Text paddingRight="2">{item.value}</Text>
                    <Ionicons name="ios-chevron-forward" color="grey" />
                </Box>
            );
        } else if (section.category === 'allow-lan') {
            content = (
                <Switch
                    isChecked={item.value as boolean}
                    size="sm"
                    onToggle={(status) => {
                        onToggleButton(status);
                    }}
                />
            );
        } else if (section.category === 'mode' || section.category === 'log-level') {
            if (item.value) {
                content = (
                    <Ionicons name="ios-checkmark" size={16} />
                );
            }
        }
        return (
            <Pressable
                style={[
                    styles.item,
                    index === 0 && styles.itemFirst,
                    index === section.data.length - 1 && styles.itemLast,
                ]}
                bg={bgDark}
                _pressed={{
                    bg: bgPressed,
                }}
                onPress={() => {
                    onItemPressed(item, index, section);
                }}
                isDisabled={!section.pressable}
            >
                <Flex justifyContent="space-between" flexDir="row" alignItems="center">
                    <Text>{item.label}</Text>
                    {content}
                </Flex>
            </Pressable>
        );
    };

    return (
        <>
            <SectionList
                p="3"
                bg="#f2f1f7"
                sections={sectionData}
                renderItem={renderItem}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={
                    ({ section: { title } }) => (
                        <View style={styles.header}>
                            <Text>{title}</Text>
                        </View>
                    )
                }
                renderSectionFooter={() => (
                    <View style={styles.sectionBetween} />
                )}
            />
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                initialFocusRef={portRef}
                closeOnOverlayClick={false}
                useRNModal
            >
                <Modal.Content>
                    <Modal.Header alignItems="center" borderBottomWidth="0"><Text>Change the Port</Text></Modal.Header>
                    <Modal.Body>
                        <Input ref={portRef} inputMode="numeric" variant="filled" _input={{ bg: 'muted.200' }} focusOutlineColor="muted.200" value={portChangeValue} onChangeText={handlePortChange} />
                    </Modal.Body>
                    <Modal.Footer justifyContent="flex-start" padding={0}>
                        <Button.Group isAttached flexGrow={1}>
                            <Button
                                variant="ghost"
                                flexGrow={1}
                                onPress={() => {
                                    setPortChangeValue('');
                                    setShowModal(false);
                                }}
                                borderRightColor="muted.200"
                                borderRightWidth={1}
                                _pressed={{
                                    bg: bgPressed,
                                }}
                            >
                                <Text>Cancel</Text>
                            </Button>
                            <Button
                                variant="ghost"
                                flexGrow={1}
                                _pressed={{
                                    bg: bgPressed,
                                }}
                                onPress={() => {
                                    handlePortSave();
                                }}
                            >
                                <Text>Save</Text>
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}

export default Setting;
