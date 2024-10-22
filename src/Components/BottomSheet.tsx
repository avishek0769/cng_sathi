import { Button, Pressable, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo, useRef } from 'react'
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { AppContext } from '../Context'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function BottomSheetComp(): JSX.Element {
    const snapPoints = useMemo(() => ["25%", "83%"], [])
    const { bottomSheetRef, setIsMyLocBtnHidden } = useContext(AppContext)
    const buttons = [
        { title: 'Start Journey', backgroundColor: '#2196f3', color: "white", width: 140, icon: "navigation" },
        { title: 'Direction', backgroundColor: null, color: "#2196f3", width: 104, icon: "directions" },
        { title: 'Update', backgroundColor: null, color: "#2196f3", width: 96, icon: "update" },
    ];
    const comments = [
        {
            name: "John Doe",
            profilePic: "https://example.com/john-profile.jpg",
            comment: "This is a really insightful post. Thanks for sharing!"
        },
        {
            name: "Jane Smith",
            profilePic: "https://example.com/jane-profile.jpg",
            comment: "I totally agree with the points made in this article."
        },
        {
            name: "Alex Johnson",
            profilePic: "https://example.com/alex-profile.jpg",
            comment: "Great read! I learned a lot from this."
        },
        {
            name: "Emily Davis",
            profilePic: "https://example.com/emily-profile.jpg",
            comment: "Thanks for posting this. Looking forward to more content!"
        },
        {
            name: "Michael Brown",
            profilePic: "https://example.com/michael-profile.jpg",
            comment: "This helped clarify some things I was confused about."
        }
    ];

    return (
        <BottomSheet style={styles.bottomSheet} index={-1} snapPoints={snapPoints} ref={bottomSheetRef} enableContentPanningGesture={false} enableOverDrag={false} >
            <Pressable style={styles.crossIcon} onPress={() => {
                bottomSheetRef?.current?.close();
                setIsMyLocBtnHidden(false)
            }}>
                <Icon name='cancel' color={"#000"} size={22} />
            </Pressable>
            <BottomSheetScrollView style={styles.bottomSheetView}>
                <Text style={styles.pumpName}>Behala Petrol Pump Behala Petrol Pump</Text>
                <View style={{ flexDirection: "row", gap: 5, marginTop: 4, alignItems: "center" }}>
                    <Icon name='location-pin' size={25} color={"#2196f3"} style={{ marginTop: 7, height: 30 }} />
                    <Text style={styles.pumpAddress}>Behala Petrol Pump, kolkata - 799236, B e h a l a Petrol Pump, kolkata - 799236 </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                    <Icon name='gpp-good' size={25} color={"green"} style={{ marginTop: 7, height: 30 }} />
                    <Text style={[styles.pumpAddress, { fontWeight: "500", color: "green" }]}>CNG is available</Text>
                </View>

                <BottomSheetFlatList
                    horizontal
                    contentContainerStyle={{ marginTop: 15, height: 70 }}
                    data={buttons}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => (
                        <Pressable style={[styles.btmSheetBtn, { backgroundColor: item.backgroundColor || "white", width: item.width, marginLeft: item.backgroundColor ? 0 : 10 }]}>
                            <Icon name={item.icon} size={20} color={item.backgroundColor ? "white" : "#2196f3"} style={{ marginLeft: -5 }} />
                            <Text style={{ color: item.color, fontWeight: "500", fontSize: 16 }}>{item.title}</Text>
                        </Pressable>
                    )}
                />

                <Text style={{ fontWeight: "600", color: "#979dac", fontSize: 23, marginLeft: 6, marginBottom: 7 }}>Additional Information</Text>

                <View style={styles.addtnlInfo}>
                    <Icon name='directions-car' size={24} color={"#2196f3"} />
                    <Text style={styles.addtnlInfoText}>Number of cars in queue : </Text>
                    <Text style={[styles.text, { fontSize: 17, color: "green" }]}>20-30</Text>
                </View>
                <View style={styles.addtnlInfo}>
                    <Icon name='gas-meter' size={24} color={"#2196f3"} />
                    <Text style={styles.addtnlInfoText}>Amount of CNG : </Text>
                    <Text style={[styles.text, { fontSize: 17 }]}>600 kg</Text>
                </View>
                <View style={styles.addtnlInfo}>
                    <Icon name='baby-changing-station' size={24} color={"#2196f3"} />
                    <Text style={styles.addtnlInfoText}>Pressure : </Text>
                    <Text style={[styles.text, { fontSize: 17, color: "#ffb703" }]}>descent</Text>
                </View>
                <View style={styles.addtnlInfo}>
                    <Icon name='access-time' size={24} color={"#2196f3"} />
                    <Text style={styles.addtnlInfoText}>When CNG arrived in the station : </Text>
                    <Text style={[styles.text, { fontSize: 17 }]}>5:00 pm</Text>
                </View>
                <View style={styles.addtnlInfo}>
                    <Icon name='more-time' size={24} color={"#2196f3"} />
                    <Text style={styles.addtnlInfoText}>This data is updated on : </Text>
                    <Text style={[styles.text, { fontSize: 17 }]}>6:00 pm</Text>
                </View>

                <Text style={{ fontWeight: "600", color: "#979dac", fontSize: 23, marginTop: 18, marginLeft: 6, marginBottom: 10 }}>Feedbacks</Text>

                {comments.map((item, index: number) => (
                    <>
                        <View key={item.name} style={{ flexDirection: "row", gap: 12, backgroundColor: "#e9ecef", borderRadius: 10, padding: 10, marginBottom: 5 }}>
                            <View>
                                <Image style={{ width: 42, height: 42, borderRadius: 1000, resizeMode: "contain" }} source={{ uri: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" }} />
                            </View>
                            <View>
                                <Text style={[styles.text, { fontSize: 17, fontWeight: "500" }]}>{item.name} </Text>
                                <Text style={[styles.text, { paddingRight: 40 }]}>{item.comment} </Text>
                            </View>
                        </View>
                        {index == comments.length - 1 && (
                            <TouchableOpacity onPress={() => {}}>
                                <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                                    Go to Example.com
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                ))}
            </BottomSheetScrollView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    options: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    text: {
        color: "black"
    },
    pumpName: {
        fontSize: 26,
        color: "black",
        fontWeight: "500",
        marginLeft: 6
    },
    bottomSheet: {
        position: "absolute",
        zIndex: 10000
    },
    bottomSheetView: {
        paddingHorizontal: 11,
        position: "relative",
    },
    pumpAddress: {
        color: "black",
        fontSize: 17,
        marginTop: 3,
        paddingRight: 25
    },
    btmSheetBtn: {
        borderRadius: 200,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderColor: "#adb5bd",
        borderWidth: 1,
        flexDirection: "row",
        gap: 3
    },
    crossIcon: {
        position: "absolute",
        right: 14,
        zIndex: 10000
    },
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