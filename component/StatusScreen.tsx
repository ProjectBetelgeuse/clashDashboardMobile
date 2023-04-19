import { StyleSheet, Text, View } from 'react-native';

export function StatusScreen() {
    return (
        <View style={styles.container}>
            <Text>Status Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
    },
});
