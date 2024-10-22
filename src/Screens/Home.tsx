import { Button, Image, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import BottomSheetComp from '../Components/BottomSheet'
import { AppContext } from '../Context'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Map from '../Components/Map'


export default function Home() {
    const { bottomSheetRef, isMyLocBtnHidden } = useContext(AppContext)

    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" />

            <View style={styles.searchInputSection}>
                <Icon name='location-pin' style={styles.mapLogo} size={36} color={"black"} />
                <Image source={{ uri: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" }} style={styles.userImage} />
                <TextInput style={styles.searchInput} placeholder='Search places' />
            </View>

            <ScrollView horizontal style={styles.options} contentContainerStyle={{ paddingRight: 16 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                <Pressable style={styles.optionBtns}>
                    <Icon name='location-on' size={19} color={"#555555"} />
                    <Text style={styles.optionBtnTxt}>Nearest pumps</Text>
                </Pressable>
                <Pressable style={styles.optionBtns}>
                    <Icon name='local-gas-station' size={19} color={"#555555"} />
                    <Text style={styles.optionBtnTxt}>CNG Available pumps</Text>
                </Pressable>
                <Pressable style={styles.optionBtns}>
                    <Icon name='local-gas-station' size={19} color={"#555555"} />
                    <Text style={styles.optionBtnTxt}>Best CNG Option</Text>
                </Pressable>
            </ScrollView>

            <TouchableOpacity style={[styles.myLocationBtn, isMyLocBtnHidden ? { display: "none" } : null]}>
                <Icon name='my-location' size={35} />
            </TouchableOpacity>

            <Map />

            <BottomSheetComp />
        </>
    )
}

const styles = StyleSheet.create({
    optionBtnTxt: {
        color: "#555555",
        fontWeight: "500"
    },
    searchInput: {
        backgroundColor: "white",
        borderRadius: 1000,
        marginHorizontal: 12,
        paddingHorizontal: 50,
        marginTop: 30,
        fontSize: 17,
    },
    options: {
        position: "absolute",
        flexDirection: "row",
        marginTop: 10,
        height: 38,
        top: 78,
        zIndex: 100
    },
    optionBtns: {
        backgroundColor: "white",
        paddingRight: 17,
        paddingLeft: 11,
        paddingVertical: 8,
        borderRadius: 100,
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        height: "100%",
        marginLeft: 12
    },
    searchInputSection: {
        position: "relative",
        zIndex: 100
    },
    userImage: {
        width: 43,
        height: 43,
        borderRadius: 1000,
        resizeMode: "contain",
        position: "absolute",
        zIndex: 100,
        right: 16,
        top: 33,
    },
    mapLogo: {
        position: "absolute",
        zIndex: 100,
        top: 36,
        left: 18
    },
    myLocationBtn: {
        position: "absolute",
        backgroundColor: "#2196f3",
        padding: 12,
        borderRadius: 100,
        bottom: 20,
        right: 20,
        zIndex: 100,
    }
})