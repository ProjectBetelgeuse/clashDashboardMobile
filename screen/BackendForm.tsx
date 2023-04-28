import { View } from 'react-native';
import {
    Button,
    Center, FormControl, Input, PresenceTransition, Text,
} from 'native-base';
import { useState } from 'react';
import wretch from 'wretch';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ErrorMessage{
    message:string
}
export default function BackendForm(
    { handleSubmit }: {handleSubmit:(url:string, auth:string)=>void},
) {
    const [url, setURL] = useState('');
    const [auth, setAuth] = useState('');
    const [errors, setErrors] = useState({} as ErrorMessage);
    const handleSubmitInternal = async () => {
        const pattern = /^(http|https):\/\/([\w\d\-_]+(\.[\w\d\-_]+)+)(:(\d+))?([\w\d\-.?/!$@]+)*$/;
        if (pattern.test(url)) {
            try {
                await wretch(`${url}/version`).auth(`Bearer ${auth}`).get().json();
                await AsyncStorage.setItem('clashURL', url);
                await AsyncStorage.setItem('clashAuth', auth);
                handleSubmit(url, auth);
            } catch (err) {
                setErrors({
                    message: "Couldn't connect. Please try again",
                });
            }
        } else {
            setErrors({
                message: 'Please input a valid URL that start with http:// or https://',
            });
        }
    };

    return (
        <Center flex={1} px={5}>
            <Text pb={10}>Input the Clash backend API URL</Text>
            <FormControl isInvalid={'message' in errors}>
                <FormControl.Label><Text>API Base URL</Text></FormControl.Label>
                <Input
                    value={url}
                    onChangeText={(urlText) => setURL(urlText)}
                    autoCapitalize="none"
                    _input={{ bg: 'muted.100' }}
                    focusOutlineColor="muted.500"
                />
                <FormControl.Label><Text>Secret</Text></FormControl.Label>
                <Input
                    value={auth}
                    onChangeText={(authText) => setAuth(authText)}
                    autoCapitalize="none"
                    _input={{ bg: 'muted.100' }}
                    focusOutlineColor="muted.500"
                />
                {'message' in errors ? (
                    <FormControl.ErrorMessage>
                        <Text>
                            {errors.message}
                        </Text>
                    </FormControl.ErrorMessage>
                ) : <Text />}
            </FormControl>
            <FormControl pt={5}>
                <Button bg="muted.500" onPress={() => handleSubmitInternal()}><Text color="white">Enter</Text></Button>
            </FormControl>
        </Center>
    );
}
