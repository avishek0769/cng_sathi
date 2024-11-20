import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { MyAccountParamList } from '../Screens/MyAccount'

export default function NoAccount({navigation}: MyAccountParamList) {

    return (
        <View style={{justifyContent: "center", alignItems: "center", height: "90%"}}>
            <Icon name='assignment-late' size={36} color={"#adb5bd"} />
            <Text style={{fontWeight: "600", fontSize: 22, color: "#adb5bd"}}>You are not signed in !</Text>

            <View style={{flexDirection: "row", gap: 17, marginTop: 16}}>
                <TouchableOpacity onPress={() => navigation.navigate("CreateSession", {signUp: true})} style={[styles.button, {backgroundColor: "#2196f3"}]}>
                    <Text style={{color: "white", fontWeight: "600", fontSize: 17}}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("CreateSession", {signUp: false})} style={[styles.button, {borderColor: "#2196f3", borderWidth: 1}]}>
                    <Text style={{color: "#2196f3", fontWeight: "600", fontSize: 17}}>Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 1000
    }
})