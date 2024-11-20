import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View, Image, Vibration } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { BottomSheetScrollView, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import SelectOneRange from './SelectOneRange'
import SelectOneAmongThreeBtns from './SelectOneAmongThreeBtns'
import FeedbackCard from './FeedbackCard'
import { HomeScreenNavigationProp } from '../Screens/Home'
import Snackbar from 'react-native-snackbar'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { AppContext } from '../Context'
import { domain } from '../constants'
import { Animated } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FlashMessage from 'react-native-flash-message'

type ArrivedBottomSheetParamList = HomeScreenNavigationProp & {
    messRef: React.RefObject<FlashMessage>
}

export default function ArrivedBottomSheet({ navigation, route, messRef }: ArrivedBottomSheetParamList) {
    const { setIsArrived, stationData, setStationData, bottomSheetRef, setIsMyLocBtnHidden, currentUser, setSnapIndex, accessToken } = useContext(AppContext)
    const [selectedQueueBtn, setSelectedQueueBtn] = useState<number>(-1)
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [commentInput, setCommentInput] = useState<string>("")
    const [commentLoading, setCommentLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [openMenuId, setOpenMenuId] = useState<null | string>(null); // Track which menu is open
    const [fadeAnim] = useState(new Animated.Value(0)); // Default opacity for menus

    // Function to toggle the menu visibility for a specific comment
    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id); // Close the menu if the same menu is clicked again
    };
    // Animate fade effect when a menu is opened/closed
    useEffect(() => {
        if (openMenuId !== null) {
            Animated.timing(fadeAnim, {
                toValue: 1, // Fade in when a menu is open
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0, // Fade out when no menu is open
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [openMenuId]);

    console.log(accessToken);
    const handleAddComment = () => {
        if (commentInput != "") {
            if (currentUser) {
                setCommentLoading(true)
                setCommentInput("")
                fetch(`${domain}/comment/addComment`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        stationId: stationData?._id,
                        message: commentInput
                    })
                })
                    .then(res => {
                        if (res.status > 399) {
                            setCommentLoading(false)
                            Snackbar.show({
                                text: "Something went wrong, try again !",
                                backgroundColor: "red"
                            })
                            return false
                        }
                        else return res.json()
                    })
                    .then(data => {
                        if (data && stationData) {
                            setCommentLoading(false)
                            setStationData({
                                ...stationData,
                                comments: [
                                    ...stationData.comments,
                                    {
                                        _id: data.data.commentId,
                                        commenter: {
                                            _id: currentUser._id,
                                            fullname: currentUser.fullname,
                                            username: currentUser.username,
                                            avatar: currentUser.avatar,
                                        },
                                        comment: commentInput,
                                        station: stationData?._id
                                    }
                                ]
                            })
                        }
                    })
            }
            else {
                navigation.navigate("CreateSession", { signUp: true })
            }
        }
        else {
            Snackbar.show({
                text: "Comment connot be empty !",
                backgroundColor: "red"
            })
        }
    }
    const handleAfterUpdate = (data: any) => {
        setLoading(false)
        AsyncStorage.getItem("placesUpdated").then(item => {
            if (item != null) {
                let parsedItem = JSON.parse(item)
                AsyncStorage.setItem("placesUpdated", JSON.stringify([...parsedItem, { placeId: stationData!.place_id, exp: Date.now() }]))
            }
            else {
                AsyncStorage.setItem("placesUpdated", JSON.stringify([{ placeId: stationData!.place_id, exp: Date.now() }]))
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
    }
    const handleUpdateStatus = () => {
        if (currentUser) {
            let trustScore = ((currentUser!.totalUpdates - currentUser!.falseUpdates) / currentUser!.totalUpdates) * 100
            // let relevancy = (trustScore / 100) * 10;
            let relevancy = 50

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
                fetch(`${domain}/station/updateStationStatus?cngStatus=${selectedOption}&queue=${selectedQueueBtn}&placeId=${stationData!.place_id}&relevancy=${relevancy}`, {
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
        else navigation.navigate("CreateSession", { signUp: true })
    }

    return (
        <BottomSheetScrollView keyboardShouldPersistTaps={'handled'} style={{ paddingHorizontal: 11 }}>
            <Text style={{ color: "#2196f3", fontSize: 21, fontWeight: "600", }}>You have arrived at {stationData?.name} !</Text>

            <BottomSheetView style={{ backgroundColor: "#eaf4f4", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, marginTop: 10 }}>
                <Text style={styles.questionTxt}>Please report the number of cars in the queue</Text>

                <BottomSheetView style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, padding: 0 }}>
                    {Array(10).fill("").map((_, index) => (
                        <SelectOneRange width={77} text={`${index * 10} - ${(index + 1) * 10}`} key={String(index)} selectedRange={selectedQueueBtn} setSelectedRange={setSelectedQueueBtn} index={index} />
                    ))}
                    <Pressable onPress={() => setSelectedQueueBtn(10)} style={[styles.queueBtn, { backgroundColor: selectedQueueBtn == 10 ? "#ced4da" : "white", marginBottom: 10, marginLeft: 8 }]} >
                        <Text style={{ color: "black" }}>100+</Text>
                    </Pressable>
                </BottomSheetView>

                <Text style={[styles.questionTxt, { marginTop: 4 }]}>CNG status of the pump</Text>

                <SelectOneAmongThreeBtns selectedOption={selectedOption} setSelectedOption={setSelectedOption} first='Available' second='Low' third='Not Available' />

                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8, height: 40, marginBottom: 10 }}>
                    <TouchableOpacity onPress={handleUpdateStatus} style={{ backgroundColor: "#2196f3", paddingHorizontal: 140, borderRadius: 100, justifyContent: "center" }}>
                        {loading ? <ActivityIndicator size={30} color={"white"} /> : <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Update</Text>}
                    </TouchableOpacity>
                </View>
            </BottomSheetView>

            <Text style={{ fontWeight: "600", color: "#979dac", fontSize: 23, marginTop: 18, marginLeft: 6 }}>Responsible for the update</Text>

            <BottomSheetView style={styles.cardStyle}>
                <BottomSheetView>
                    <Image style={{ width: 42, height: 42, borderRadius: 1000, resizeMode: "contain" }} source={{ uri: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" }} />
                </BottomSheetView>
                <BottomSheetView>
                    <Text style={[{ color: "black", fontSize: 17, fontWeight: "500" }]}>Avishek Adhikary </Text>
                    <Text style={[{ color: "#495057", paddingRight: 34, marginBottom: 5, fontSize: 15 }]}>avishek09 </Text>
                </BottomSheetView>
            </BottomSheetView>

            <Text style={{ fontWeight: "600", color: "#979dac", fontSize: 23, marginTop: 14, marginLeft: 6, marginBottom: 10 }}>Comments</Text>

            <BottomSheetView style={{ flexDirection: "row", marginBottom: 10, justifyContent: "space-between", alignItems: "center" }}>
                <BottomSheetTextInput autoFocus={false} value={commentInput} onChangeText={setCommentInput} placeholder='Write a comment...' placeholderTextColor={"#adb5bd"} style={{ borderColor: "#adb5bd", borderWidth: 1, width: "84%", borderRadius: 7, fontSize: 15, color: "black", paddingHorizontal: 14 }} />
                <TouchableOpacity onPress={handleAddComment} style={{ borderRadius: 800, backgroundColor: "#2196f3", width: 43, height: 43, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {commentLoading ? <ActivityIndicator size={27} color={"white"} /> : <Icon name='send' size={20} color={"white"} />}
                </TouchableOpacity>
            </BottomSheetView>

            {stationData && stationData.comments.length > 0 ? stationData.comments.map((item, index: number) => (
                <BottomSheetView key={String(index)}>
                    <FeedbackCard fadeAnim={fadeAnim} openMenuId={openMenuId} toggleMenu={toggleMenu} key={item._id} item={item} inBottomSheet={true} />
                    {index == 4 && (
                        <TouchableOpacity key={String(index)} style={{ marginVertical: 10 }} onPress={() => navigation.navigate("Feedback", { stationId: stationData._id })}>
                            <Text style={{ color: '#2196f3', textAlign: "center", fontSize: 16 }}>View all comments</Text>
                        </TouchableOpacity>
                    )}
                </BottomSheetView>
            )) :
                (
                    <Text style={{ color: "black", textAlign: "center", fontSize: 17, marginTop: 10 }}>No Comments</Text>
                )}

            <BottomSheetView style={{ flexDirection: "row", marginBottom: 14, marginTop: 16, justifyContent: "space-evenly" }}>
                <TouchableOpacity style={{ width: 160, backgroundColor: "#ef233c", borderRadius: 100, justifyContent: "center", height: 40, alignItems: "center" }}>
                    <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIsArrived(false)
                    setStationData(null)
                    setSnapIndex(-1)
                    bottomSheetRef?.current?.close()
                    setIsMyLocBtnHidden(false)
                }} style={{ width: 160, borderColor: "#ef233c", borderRadius: 100, justifyContent: "center", height: 40, borderWidth: 1, flexDirection: "row", gap: 6, alignItems: "center" }}>
                    <Icon name='wrong-location' size={22} color={"#ef233c"} style={{ marginLeft: -5 }} />
                    <Text style={{ fontSize: 17, fontWeight: "600", color: "#ef233c" }}>End Journey</Text>
                </TouchableOpacity>
            </BottomSheetView>

        </BottomSheetScrollView>
    )
}

const styles = StyleSheet.create({
    questionTxt: {
        fontSize: 18,
        fontWeight: "500",
        color: "#343a40"
    },
    queueBtn: {
        paddingVertical: 8,
        borderRadius: 100,
        borderColor: "#ced4da",
        borderWidth: 1,
        width: 77,
        alignItems: "center"
    },
    cardStyle: {
        flexDirection: "row",
        gap: 12,
        backgroundColor: "#e3f2fd",
        borderRadius: 10,
        padding: 10,
        paddingTop: 7,
        marginTop: 12
    }
})
