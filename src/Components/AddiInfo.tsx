import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import Icon from 'react-native-vector-icons/MaterialIcons'

type AddiInfoParamList = {
    info: string;
    value: number | string;
    icon: string;
    isNumber: boolean;
}

export default function AddiInfo({ info, value, icon, isNumber }: AddiInfoParamList) {
    
    const formatTime = (): string => {
        const date = new Date(value);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
        return formattedTime
    }
    
    return (
        <BottomSheetView style={styles.addtnlInfo}>
            <Icon name={icon} size={24} color={"#2196f3"} />
            <Text style={styles.addtnlInfoText}>{info} </Text>
            {isNumber ? (
                <Text style={[{ fontSize: 17, color: value == 0 ? "gray" : (value == 1 ? "green" : (value == 2 ? "#ffb703" : (value == 3 ? "#ef233c" : "black"))) }]}>
                    {value == 0 ? "No update" : (value == 1 ? "High" : (value == 2 ? "Moderate" : (value == 3 ? "Low" : (Number(value) > 1200 ? formatTime() : value + " kg"))))}
                </Text>
            ) :
                (
                    <Text style={[{ fontSize: 17, color: "black" }]}>
                        {value}
                    </Text>
                )}

        </BottomSheetView>
    )
}

const styles = StyleSheet.create({
    addtnlInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },
    addtnlInfoText: {
        fontSize: 17,
        fontWeight: "600",
        marginLeft: 6,
        color: "#212529"
    }
})