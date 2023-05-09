import {
    Button,
    Center, FormControl, Input, Text, useToast,
} from 'native-base';
import { useEffect, useState } from 'react';
import wretch from 'wretch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AbortAddon from 'wretch/dist/addons/abort';

interface ErrorMessage{
    message:string
}

// Todo: when load again, the data are retrivied from storage, this page will flash a bit
export default function BackendForm(
    { handleSubmit }: {handleSubmit:(url:string, auth:string)=>void},
) {
    const [url, setURL] = useState('');
    const [auth, setAuth] = useState('');
    const [errors, setErrors] = useState({} as ErrorMessage);
    const toast = useToast();

    useEffect(() => {
        const getURL = async () => {
            // await AsyncStorage.clear();
            const clashURL = await AsyncStorage.getItem('clashURL');
            const clashAuth = await AsyncStorage.getItem('clashAuth');
            try {
                if (clashURL !== null && clashAuth !== null) {
                    await wretch(`${clashURL}/version`).auth(`Bearer ${clashAuth}`).addon(AbortAddon()).get()
                        .setTimeout(1000)
                        .json();
                    handleSubmit(clashURL, clashAuth);
                }
            } catch (err) {
                toast.show({
                    title: 'Network Error, Please input the correct URL',
                    placement: 'top',
                });
            }
        };
        getURL();
    }, []);
    const handleSubmitInternal = async () => {
        const pattern = /^(http|https):\/\/([\w\d\-_]+(\.[\w\d\-_]+)+)(:(\d+))?([\w\d\-.?/!$@]+)*$/;
        if (pattern.test(url)) {
            try {
                await wretch(`${url}/version`).auth(`Bearer ${auth}`).addon(AbortAddon()).get()
                    .setTimeout(1000)
                    .json();
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
