import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Pressable, TextInput } from 'react-native-gesture-handler'
import { CreateSessionParamList } from '../Screens/CreateSession'
import Snackbar from 'react-native-snackbar'
import { domain } from '../constants'
import Loading from './Loading'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppContext } from '../Context'


export default function Signup({ navigation }: CreateSessionParamList) {
    const [fullname, setFullname] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const {setCurrentUser} = useContext(AppContext)

    const handleSignUp = async () => {
        if(fullname.length && username.length && password.length){
            setLoading(true)
            const response = await fetch(`${domain}/user/signup`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ fullname, username, password })
            })
            if(response.status < 400){
                const accessToken = response.headers.get("accessToken")
                const refreshToken = response.headers.get("refreshToken")
                await AsyncStorage.setItem("accessToken", JSON.stringify({accessToken, exp: Date.now() + 3*24*60*60*1000}))
                await AsyncStorage.setItem("refreshToken", JSON.stringify({refreshToken, exp: Date.now() + 10*24*60*60*1000}))
                const user = await response.json()
                setLoading(false)
                setCurrentUser(user.data)
                navigation.goBack()
            }
        }
        else{
            Snackbar.show({
                text: "All the fields are required",
                backgroundColor: "red"
            })
        }
    }

    return (
        <View>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <Text style={styles.heading}>Sign up</Text>

            <View style={{ margin: 27, marginTop: 40 }}>
                <Text style={styles.fieldName}>Full name</Text>
                <TextInput value={fullname} onChangeText={setFullname} placeholder='Enter your full name' style={styles.textInput} placeholderTextColor={"gray"} />

                <Text style={styles.fieldName}>Username</Text>
                <TextInput value={username} onChangeText={setUsername} placeholder='Enter your username' style={styles.textInput} placeholderTextColor={"gray"} />

                <Text style={styles.fieldName}>Password</Text>
                <TextInput value={password} onChangeText={setPassword} placeholder='Enter your password' style={styles.textInput} placeholderTextColor={"gray"} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleSignUp} style={[styles.button, { backgroundColor: "#2196f3" }]}>
                    <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 16, flexDirection: "row" }}>
                <Text style={{ color: "black", fontSize: 16 }}>Already have an account? </Text>
                <Pressable onPress={() => navigation.navigate("CreateSession", { signUp: false })}>
                    <Text style={{ color: "#2196f3", fontWeight: "500", fontSize: 15 }}> Login</Text>
                </Pressable>
            </View>

            {loading && <Loading text='Creating your account' />}
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        color: "#2196f3",
        marginTop: 24,
        marginLeft: 22,
        fontSize: 30,
        fontWeight: "600"
    },
    textInput: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#edede9",
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
        color: "black"
    },
    fieldName: {
        color: "black",
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 7,
        marginLeft: 14
    },
    button: {
        paddingHorizontal: 130,
        paddingVertical: 10,
        borderRadius: 1000
    }
})