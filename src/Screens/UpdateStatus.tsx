import { Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ScreenParamList } from '../App'
import { TextInput } from 'react-native-gesture-handler'
import Snackbar from 'react-native-snackbar'
import SelectOneAmongThreeBtns from '../Components/SelectOneAmongThreeBtns'
import SelectOneRange from '../Components/SelectOneRange'
import { domain } from '../constants'
import { AppContext } from '../Context'
import Loading from '../Components/Loading'
import FlashMessage from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

type UpdateStatusScreenParamList = NativeStackScreenProps<ScreenParamList, "UpdateStatus">

export default function UpdateStatus({ navigation, route }: UpdateStatusScreenParamList) {
    const { messRef } = route.params;
    const [selectedOption, setSelectedOption] = useState<string>("0")
    const [selectedOptionPress, setSelectedOptionPress] = useState<string>("0")
    const [selectedQueueBtn, setSelectedQueueBtn] = useState<number>(-1)
    const [selectedTimeBtn, setSelectedTimeBtn] = useState<number>(-1)
    const [selectedQuantity, setSelectedQuantity] = useState<number>(-1)
    const { stationData, currentUser, accessToken, bottomSheetRef, setSnapIndex } = useContext(AppContext)
    const [loading, setLoading] = useState(false)

    let trustScore = ((currentUser!.totalUpdates - currentUser!.falseUpdates) / currentUser!.totalUpdates) * 100
    // let relevancy = (trustScore / 100) * 10;
    let relevancy = 40;

    function generateTimeOptions() {
        const now = new Date();
        const minutes = now.getMinutes();
        now.setMinutes(minutes < 30 ? 0 : 30, 0, 0);

        const options = [];
        for (let i = 0; i < 8; i++) {
            const timeOption = new Date(now.getTime() - i * 30 * 60 * 1000); // Subtract 30 minutes per iteration
            options.unshift(formatTime(timeOption)); // Add time in readable format
        }
        return options;
    }
    function formatTime(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const isPM = hours >= 12;
        const formattedHours = ((hours + 11) % 12 + 1); // Convert to 12-hour format
        const ampm = isPM ? "PM" : "AM";
        return `${formattedHours}:${minutes} ${ampm}`;
    }
    const timeArray = generateTimeOptions()

    const handleAfterUpdate = (data: any) => {
        setLoading(false)
        AsyncStorage.getItem("placesUpdated").then(item => {
            if(item != null){
                let parsedItem = JSON.parse(item)
                AsyncStorage.setItem("placesUpdated", JSON.stringify([...parsedItem, {placeId: stationData!.place_id, exp: Date.now()}]))
            }
            else{
                AsyncStorage.setItem("placesUpdated", JSON.stringify([{placeId: stationData!.place_id, exp: Date.now()}]))
            }
        })
        if (data.data.dbUpdated) {
            messRef?.current?.showMessage({
                message: "Success",
                description: "Your data is updated !",
                type: "success",
                duration: 5000,
                icon: "success",
                style: {
                    width: 300
                }
            });
        }
        else {
            messRef?.current?.showMessage({
                message: "Success",
                description: "Your data will be processed",
                type: "success",
                duration: 5000,
                icon: "success",
                style: {
                    width: 300
                }
            });
        }
        navigation.goBack()
        setSnapIndex(-1)
        bottomSheetRef?.current?.close()
    }

    const handleUpdate = () => {
        if (selectedOption == "3") {
            setLoading(true)
            fetch(`${domain}/station/updateStationStatus?cngStatus=3&queue=nil&pressure=nil&quantity=nil&arrivalTime=nil&placeId=${stationData!.place_id}&relevancy=${relevancy}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            .then(res => res.json())
            .then(data => {
                handleAfterUpdate(data)
            })
        }
        else if (selectedOption != "0" && selectedQueueBtn > -1) {
            setLoading(true)
            fetch(`${domain}/station/updateStationStatus?cngStatus=${selectedOption}&queue=${selectedQueueBtn}&pressure=${selectedOptionPress == "0" ? "nil" : selectedOptionPress}&quantity=${selectedQuantity != -1 ? (selectedQuantity ? "1200" : "600") : "nil"}&arrivalTime=${selectedTimeBtn != -1? timeArray[selectedTimeBtn] : "nil"}&placeId=${stationData!.place_id}&relevancy=${relevancy}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            .then(res => res.json())
            .then(data => {
                handleAfterUpdate(data)
            })
        }
        else {
            Snackbar.show({
                text: "CNG status and queue info are required !",
                backgroundColor: "red",
                duration: Snackbar.LENGTH_LONG
            })
        }
    }

    return (
        <View style={{ padding: 12, paddingLeft: 14, height: "100%" }}>
            <StatusBar translucent={true} backgroundColor="transparent" showHideTransition={'slide'} />
            <Text style={styles.heading}>Update Status</Text>

            <View>
                <Text style={[styles.questionTxt]}>What is the CNG status at the petrol pump ?</Text>

                <SelectOneAmongThreeBtns selectedOption={selectedOption} setSelectedOption={setSelectedOption} first='Available' second='Low' third='Not Available' />

                {selectedOption != "0" && selectedOption != "3" ? (<View style={{ borderWidth: 1, borderColor: "#6c757d", borderRadius: 10, padding: 7, marginTop: 5, paddingBottom: 6 }}>
                    <Text style={styles.questionTxt}>Please report the number of cars in the queue ?</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                        {Array(10).fill("").map((_, index) => (
                            <SelectOneRange width={77} key={String(index)} selectedRange={selectedQueueBtn} setSelectedRange={setSelectedQueueBtn} index={index} text={`${index * 10} - ${(index + 1) * 10}`} />
                        ))}
                        <Pressable onPress={() => setSelectedQueueBtn(10)} style={[styles.queueBtn, { backgroundColor: selectedQueueBtn == 10 ? "#ade8f4" : "white", marginBottom: 10, marginLeft: 8 }]} >
                            <Text style={{ fontSize: 15, color: "black" }}>100+</Text>
                        </Pressable>
                    </View>

                    <Text style={[styles.questionTxt, { marginTop: 16, marginBottom: 12 }]}>The quantity of CNG available (optional)</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                        <SelectOneRange width={100} selectedRange={selectedQuantity} setSelectedRange={setSelectedQuantity} index={0} text='600 kg' />
                        <SelectOneRange width={100} selectedRange={selectedQuantity} setSelectedRange={setSelectedQuantity} index={1} text='1200 kg' />
                    </View>

                    <Text style={[styles.questionTxt, { marginTop: 17 }]}>Pressure in the pipes (optional)</Text>

                    <SelectOneAmongThreeBtns selectedOption={selectedOptionPress} setSelectedOption={setSelectedOptionPress} first='High' second='Moderate' third='Low' />

                    <Text style={[styles.questionTxt, { marginTop: 5, marginBottom: 8 }]}>When CNG cylinder arrived in the pump ? (optional)</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", }}>
                        {timeArray.map((item, index) => (
                            <SelectOneRange width={77} text={item} key={String(index)} selectedRange={selectedTimeBtn} setSelectedRange={setSelectedTimeBtn} index={index} />
                        ))}
                    </View>
                </View>) : null}

                <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 24 }}>
                    <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: "#2196f3", paddingHorizontal: 26, paddingVertical: 10, borderRadius: 100 }}>
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ borderWidth: 1, borderColor: "#495057", borderRadius: 100, paddingHorizontal: 26, paddingVertical: 10 }}>
                        <Text style={{ color: "#495057", fontSize: 18, fontWeight: "500" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading && <Loading text='Updating...' />}
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "black"
    },
    heading: {
        color: "#2196f3",
        margin: 13,
        marginTop: 24,
        marginLeft: 0,
        fontSize: 30,
        fontWeight: "600"
    },
    buttonStyle: {
        paddingVertical: 8,
        paddingHorizontal: 21,
        borderRadius: 100,
        borderWidth: 1,
    },
    questionTxt: {
        fontSize: 18,
        fontWeight: "500",
        color: "#495057"
    },
    queueBtn: {
        paddingVertical: 8,
        borderRadius: 100,
        borderColor: "#ade8f4",
        borderWidth: 1,
        width: 77,
        alignItems: "center"
    },
    inputQnty: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        color: "black",
        height: 44,
        fontSize: 16
    }
})