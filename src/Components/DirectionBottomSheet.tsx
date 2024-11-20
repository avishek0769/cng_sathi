import { Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { AppContext } from '../Context'
import AddiInfo from './AddiInfo'
import { domain } from '../constants'
import Snackbar from 'react-native-snackbar'

type DirectionBottomSheetParamList = {
    setLoading: (loading: boolean) => void;
    bestOptionStations: any[]
}

export default function DirectionBottomSheet({setLoading, bestOptionStations}: DirectionBottomSheetParamList) {
    const { mapRef, setSnapIndex, stationData, routeInfo, bottomSheetRef, setIsMyLocBtnHidden, setRouteInfo, setVisibleStation, filterType, setFilterType } = useContext(AppContext)

    const handleStartJourney = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stationData?.location.coordinates[1]},${stationData?.location.coordinates[0]}`;
        Linking.openURL(googleMapsUrl)
    }

    return (
        <>
            <Pressable style={styles.crossIcon} onPress={() => {
                setSnapIndex(-1)
                bottomSheetRef?.current?.close();
                setIsMyLocBtnHidden(false)
                setRouteInfo({
                    distance: "",
                    duration: "",
                    polyline: "",
                    routeCoords: []
                })
                if (filterType == "cngAvailable") {
                    setLoading(true)
                    fetch(`${domain}/station/cngAvailableStations`).then(res => res.json())
                        .then(data => {
                            setLoading(false)
                            if (data.data.length > 0) {
                                // setIsCrossFilterBtnHidden(false)
                                setFilterType("cngAvailable")
                                let idArray: string[] = []
                                data.data.map((station: any) => {
                                    idArray.push(station._id)
                                })
                                setVisibleStation([...idArray])
                                mapRef?.current?.animateCamera({
                                    center: {
                                        latitude: 22.5744,
                                        longitude: 88.3629,
                                    },
                                    zoom: 10
                                })
                            }
                            else {
                                Snackbar.show({
                                    text: "No petrol pump has CNG available",
                                    backgroundColor: "red"
                                })
                            }
                        })
                }
                else if(filterType != "bestOption"){
                    setVisibleStation([])
                }
            }}>
                <Icon name='cancel' color={"#000"} size={22} />
            </Pressable>

            <BottomSheetView style={{ paddingHorizontal: 11 }}>
                <Text style={styles.pumpName}>{stationData?.name} </Text>
                <BottomSheetView style={{ flexDirection: "row", gap: 5, marginTop: 4, alignItems: "center" }}>
                    <Icon name='location-pin' size={25} color={"#2196f3"} style={{ marginTop: 7, height: 30 }} />
                    <Text style={styles.pumpAddress}>{stationData?.address} </Text>
                </BottomSheetView>
                <BottomSheetView style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <AddiInfo icon='directions' info='' isNumber={false} value={routeInfo.distance} />
                    <AddiInfo icon='access-time' info='' isNumber={false} value={routeInfo.duration} />
                </BottomSheetView>

                <BottomSheetView style={{ marginTop: 15, height: 70, flexDirection: "row" }}>
                    <TouchableOpacity onPress={handleStartJourney} style={[styles.btmSheetBtn, { backgroundColor: "#2196f3", width: 140, marginLeft: 0 }]}>
                        <Icon name={"navigation"} size={20} color={"white"} style={{ marginLeft: -5 }} />
                        <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>Start Journey</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetView>
        </>
    )
}

const styles = StyleSheet.create({
    pumpName: {
        fontSize: 26,
        color: "black",
        fontWeight: "500",
        marginLeft: 6
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
})
