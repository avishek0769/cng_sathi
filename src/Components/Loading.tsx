import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'

type LoadingProp = {
    text: string
}

export default function Loading({text}: LoadingProp) {
    return (
        <View style={styles.loader}>
            <Text style={{fontSize: 20, fontWeight: "600"}}>{text} </Text>
            <ActivityIndicator size={60} />
        </View>
    )
}

const styles = StyleSheet.create({
    loader: {
        position: "absolute",
        width: "107%",
        height: "106%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        opacity: 0.8,
        zIndex: 100000,
        gap: 15
    }
})