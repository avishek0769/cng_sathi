import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type SelectOneRangeParamList = {
    selectedRange: number;
    setSelectedRange: React.Dispatch<React.SetStateAction<number>>,
    index: number;
    text: string
    width: number
}

export default function SelectOneRange({selectedRange, setSelectedRange, index, text, width}: SelectOneRangeParamList) {
    return (
        <Pressable onPress={() => setSelectedRange(index)} style={[styles.queueBtn, { backgroundColor: selectedRange == index ? "#ade8f4" : "white", width }]} key={String(index)}>
            <Text style={[styles.text, { fontSize: 15 }]}> {text} </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "black"
    },
    queueBtn: {
        paddingVertical: 8,
        borderRadius: 100,
        borderColor: "#ade8f4",
        borderWidth: 1,
        width: 77,
        alignItems: "center",
        marginBottom: 8,
        marginLeft: 7
    }
})