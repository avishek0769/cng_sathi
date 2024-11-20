import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Pressable, TextInput } from 'react-native-gesture-handler'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ScreenParamList } from '../App'
import { AppContext } from '../Context'
import Signup from '../Components/Signup'
import Login from '../Components/Login'

export type CreateSessionParamList = NativeStackScreenProps<ScreenParamList, "CreateSession">

export default function CreateSession({navigation, route}: CreateSessionParamList) {

    return route.params.signUp? <Signup navigation={navigation} route={route} /> : <Login navigation={navigation} route={route} />    
    
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