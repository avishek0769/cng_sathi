import { Pressable, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Linking, Image, Animated, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { AppContext, LocationObj } from '../Context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { HomeScreenNavigationProp } from '../Screens/Home'
import AddiInfo from './AddiInfo'
import FeedbackCard from './FeedbackCard'
import Snackbar from 'react-native-snackbar'
import Geolocation from '@react-native-community/geolocation'
import FlashMessage from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocation } from '../constants'

type NotArrivedBottomSheetParamList = HomeScreenNavigationProp & {
    messRef: React.RefObject<FlashMessage>
}
export default function NotArrivedBottomSheet({ navigation, route, messRef }: NotArrivedBottomSheetParamList) {
    const { bottomSheetRef, setSnapIndex, setIsMyLocBtnHidden, stationData, currLocation, setRouteInfo, mapRef, setCurrLocation, setVisibleStation, visibleStation, setBottomSheetLoading, currentUser, setStationData, filterType } = useContext(AppContext)
    const [openMenuId, setOpenMenuId] = useState<null | string>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        if (openMenuId !== null) {
            Animated.timing(fadeAnim, {
                toValue: 1,
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
    // AsyncStorage.removeItem("placesUpdated")

    const handleDirection = async () => {
        setBottomSheetLoading(true)
        if (currLocation == null) {
            try {
                const position = await getLocation()
                const { latitude, longitude } = position.coords
                setCurrLocation({ lat: latitude, lng: longitude })
                fetchRouteData({ lat: latitude, lng: longitude })
            }
            catch (error: any) {
                setBottomSheetLoading(false)
                if (error.code == 2) {
                    Snackbar.show({
                        text: "Location is off",
                        backgroundColor: "red",
                        duration: Snackbar.LENGTH_LONG
                    })
                }
                else if (error.code === 1) {
                    Alert.alert(
                        "Location Permission",
                        "This app needs access to your location",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Give permission", style: "default", onPress: () => Linking.openSettings() }
                        ],
                        { cancelable: false }
                    )
                }
            }
        }
        else {
            fetchRouteData(currLocation)
        }
    }
    const fetchRouteData = async ({lat, lng}: LocationObj) => {
        const apiKey = 'AIzaSyD0ppWVQlibdy0Jn18flA35qOsFG21OBXo';
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${stationData?.location.coordinates[1]},${stationData?.location.coordinates[0]}&key=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.routes.length && stationData) {
                setVisibleStation([stationData._id])
                mapRef?.current?.fitToCoordinates([
                    { latitude: lat, longitude: lng },
                    { latitude: stationData.location.coordinates[1], longitude: stationData.location.coordinates[0] }
                ],
                { edgePadding: { top: 180, left: 40, right: 40, bottom: 250 } })

                const route = data.routes[0];
                const distance = route.legs[0].distance.text;
                const duration = route.legs[0].duration.text;
                const polyline = route.overview_polyline.points;
                const routeCoords = decodePolyline(polyline);
                setBottomSheetLoading(false)
                setRouteInfo({ distance, duration, polyline, routeCoords })
            }
        }
        catch (error) {
            console.log('Error fetching route:', error);
        }
    }
    const decodePolyline = (t: string, e = 5) => {
        let points = [];
        let index = 0,
            lat = 0,
            lng = 0;

        while (index < t.length) {
            let b,
                shift = 0,
                result = 0;
            do {
                b = t.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaLat = (result & 1 ? ~(result >> 1) : result >> 1);
            lat += deltaLat;

            shift = 0;
            result = 0;
            do {
                b = t.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const deltaLng = (result & 1 ? ~(result >> 1) : result >> 1);
            lng += deltaLng;

            points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return points;
    };
    const handleUpdatePress = async ()=>{
        if(currentUser){
            let canUpdate = false;
            let item = await AsyncStorage.getItem("placesUpdated")

            if(item != null){
                let parsedItem = JSON.parse(item)
                if(parsedItem.length == 0){
                    canUpdate = true;
                }
                else{
                    let isPresent = false;
                    let reducedArray = parsedItem.reduce((acc: any[], item: any) => {
                        if (item.placeId == stationData!.place_id) {
                            isPresent = true
                            if ((Date.now() - item.exp) >= 30 * 60 * 1000) {
                                canUpdate = true;
                                return acc;
                            }
                        }
                        acc.push(item);
                        return acc;
                    }, []);

                    !isPresent? canUpdate = true : null;
                    console.log(reducedArray);
                    AsyncStorage.setItem("placesUpdated", JSON.stringify(reducedArray))
                }
            }
            else canUpdate = true;
            
            if(canUpdate) navigation.navigate("UpdateStatus", {messRef: messRef});
            else messRef.current?.showMessage({
                message: "Already updated",
                description: "Wait for 30 mins to update again",
                type: "warning",
                duration: 5000,
                icon: "warning",
                style: {
                    width: 330
                }
            })
        }
        else{
            navigation.navigate("CreateSession", {signUp: true})
        }
    }
    const handleStartJourney = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stationData?.location.coordinates[1]},${stationData?.location.coordinates[0]}`;
        Linking.openURL(googleMapsUrl)
    }

    if (stationData == null || stationData == undefined) {
        return <ActivityIndicator style={{ margin: "auto", marginTop: 23 }} size={40} color={"#2196f3"} />
    }
    else {
        return (
            <>
                <Pressable style={styles.crossIcon} onPress={() => {
                    setSnapIndex(-1)
                    bottomSheetRef?.current?.close();
                    setIsMyLocBtnHidden(false)
                }}>
                    <Icon name='cancel' color={"#000"} size={22} />
                </Pressable>
                <BottomSheetScrollView keyboardShouldPersistTaps={'handled'} style={styles.bottomSheetView}>
                    <Text style={styles.pumpName}>{stationData?.name} </Text>
                    <BottomSheetView style={{ flexDirection: "row", gap: 5, marginTop: 4, alignItems: "center" }}>
                        <Icon name='location-pin' size={25} color={"#2196f3"} style={{ marginTop: 7, height: 30 }} />
                        <Text style={styles.pumpAddress}>{stationData?.address} </Text>
                    </BottomSheetView>
                    <BottomSheetView style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                        <Icon name={stationData?.cng_available == 1 ? "gpp-good" : (stationData?.cng_available == 2 ? "minimize" : (stationData?.cng_available == 3 ? "do-not-disturb" : "sentiment-neutral"))} size={25} color={stationData?.cng_available == 1 ? "green" : (stationData?.cng_available == 2 ? "#ffb703" : (stationData?.cng_available == 3 ? "#ef233c" : "gray"))} style={{ marginTop: 7, height: 30 }} />
                        <Text style={[styles.pumpAddress, { fontWeight: "500", color: stationData?.cng_available == 1 ? "green" : (stationData?.cng_available == 2 ? "#ffb703" : (stationData?.cng_available == 3 ? "#ef233c" : "gray")) }]}>
                            {stationData?.cng_available == 1 ? "CNG is Available" : (stationData?.cng_available == 2 ? "CNG is running low but available" : (stationData?.cng_available == 3 ? "CNG is not Available" : "No update"))}
                        </Text>
                    </BottomSheetView>

                    <BottomSheetView style={{ marginTop: 6, height: 70, flexDirection: "row" }}>
                        <TouchableOpacity onPress={handleStartJourney} style={[styles.btmSheetBtn, { backgroundColor: "#2196f3", width: 140, marginLeft: 0 }]}>
                            <Icon name={"navigation"} size={20} color={"white"} style={{ marginLeft: -5 }} />
                            <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>Start Journey</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDirection} style={[styles.btmSheetBtn, { width: 104, marginLeft: 10 }]}>
                            <Icon name={"directions"} size={20} color={"#2196f3"} style={{ marginLeft: -5 }} />
                            <Text style={{ color: "#2196f3", fontWeight: "500", fontSize: 16 }}>Direction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdatePress} style={[styles.btmSheetBtn, { width: 96, marginLeft: 10 }]}>
                            <Icon name={"update"} size={20} color={"#2196f3"} style={{ marginLeft: -5 }} />
                            <Text style={{ color: "#2196f3", fontWeight: "500", fontSize: 16 }}>Update</Text>
                        </TouchableOpacity>
                    </BottomSheetView>

                    <Text style={{ fontWeight: "600", color: "#979dac", fontSize: 23, marginLeft: 6, marginBottom: 7 }}>Additional Information</Text>

                    <AddiInfo info='Number of cars in queue : ' value={stationData.queue} icon="directions-car" isNumber={false} />
                    <AddiInfo info='Amount of CNG : ' value={stationData.cng_amount} icon="gas-meter" isNumber={true} />
                    <AddiInfo info='Pressure : ' value={stationData.pressure} icon="baby-changing-station" isNumber={true} />
                    <AddiInfo info='When CNG arrived in the station : ' value={stationData.cng_arrival_time} icon="access-time" isNumber={true} />
                    <AddiInfo info='This data is updated on : ' value={stationData.updatedAt} icon="more-time" isNumber={true} />

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

                    <Text style={{ fontWeight: "600", color: "#979dac", fontSize: 23, marginTop: 18, marginLeft: 6, marginBottom: 10 }}>Comments</Text>

                    {stationData && stationData.comments.length >= 1 ? stationData.comments.map((item, index: number) => (
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
                </BottomSheetScrollView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    crossIcon: {
        position: "absolute",
        top: -2,
        right: 10,
        zIndex: 10000,
        padding: 4,
    },
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