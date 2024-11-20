import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function NoInternet() {
    return (
        <View style={{ justifyContent: "center", alignItems: "center", height: "90%" }}>
            <Icon name='signal-wifi-statusbar-connected-no-internet-4' size={36} color={"#2196f3"} />
            <Text style={{color: "gray", fontSize: 20, fontWeight: "600", letterSpacing: 1}}>No Internet</Text>
        </View>
    )
}

const styles = StyleSheet.create({})