import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type SelectOneAmongThreeBtnsParamList = {
    selectedOption: string;
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    first: string;
    second: string;
    third: string
}

export default function SelectOneAmongThreeBtns({selectedOption, setSelectedOption, first, second, third} : SelectOneAmongThreeBtnsParamList) {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 5, marginTop: 10, marginBottom: 10 }}>
            <Pressable onPress={() => {
                setSelectedOption("1")
            }
            } style={[styles.buttonStyle, { borderColor: "#52b788", backgroundColor: selectedOption == "1" ? "#52b788" : "white" }]} >
                <Text style={[{ color: selectedOption == "1" ? "white" : "#52b788", fontWeight: "500", fontSize: 16 }]}>{first}</Text>
            </Pressable>
            <Pressable onPress={() => {
                setSelectedOption("2")
            }
            } style={[styles.buttonStyle, { borderColor: "#ffb703", backgroundColor: selectedOption == "2" ? "#ffb703" : "white" }]} >
                <Text style={[{ color: selectedOption == "2" ? "white" : "#ffb703", fontWeight: "500", fontSize: 16 }]}>{second}</Text>
            </Pressable>
            <Pressable onPress={() => {
                setSelectedOption("3")
            }
            } style={[styles.buttonStyle, { borderColor: "#ef233c", backgroundColor: selectedOption == "3" ? "#ef233c" : "white" }]} >
                <Text style={[{ color: selectedOption == "3" ? "white" : "#ef233c", fontWeight: "500", fontSize: 16 }]}>{third}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        paddingVertical: 8,
        paddingHorizontal: 21,
        borderRadius: 100,
        borderWidth: 1,
    },
})