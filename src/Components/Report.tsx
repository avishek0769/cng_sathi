import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

type ReportParamList = {

}

export default function Report({report}: any) {
    return (
        <View style={{ flexDirection: "row", gap: 9, backgroundColor: "#e9ecef", marginHorizontal: 15, padding: 5, paddingVertical: 10, borderRadius: 8, marginTop: 5 }}>
            <Icon name='taxi-alert' size={30} color={"#ef233c"} />
            <Text style={{ color: "black", fontSize: 17, paddingRight: 10, fontWeight: "500", paddingEnd: 40 }}>A report has been raised against you, for updating invalid status !</Text>
        </View>
    )
}

const styles = StyleSheet.create({})