import { Alert, Image, Linking, PermissionsAndroid, Platform, StyleSheet, Text, Vibration, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Geolocation from '@react-native-community/geolocation'
import { AppContext, Station } from '../Context'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { domain, getLocation } from '../constants'
import Snackbar from 'react-native-snackbar'
import Tts from 'react-native-tts'

type MapMarker = {
    station: Station;
}
export default function Map() {
    const { bottomSheetRef, mapRef, setIsMyLocBtnHidden, currLocation, setCurrLocation, setStationData, stationData, snapIndex, isConnected, routeInfo, visibleStation, filterType, setIsArrived, setSnapIndex, allStations, setAllStations,  } = useContext(AppContext)
    const [endJourney, setEndJourney] = useState<string>()

    const GEOFENCE_RADIUS = 10;
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    // console.log('Currrr --> ', currLocation);

    useEffect(() => {
        const updateLocation = async () => {
            try {
                const position = await getLocation()
                const { latitude, longitude } = position.coords

                for (const station of allStations) {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        station.location.coordinates[1],
                        station.location.coordinates[0]
                    );
                    // if (station.place_id == "abc123def456"){
                    //     console.log("Distance--> ", distance);
                    //     console.log("Place id--> ", station.place_id);
                    //     console.log("End Journey--> ", endJourney);
                    //     console.log("Condition--> ", endJourney != station.place_id)
                    // }
                    if (distance <= GEOFENCE_RADIUS && endJourney != station.place_id) {
                        console.log('Gotcha !');
                        try {
                            const res = await fetch(`${domain}/station/getStationById/${station._id}`);
                            const data = await res.json();
                            setStationData(data.data);
                            setIsMyLocBtnHidden(true);
                            setIsArrived(true);
                            setSnapIndex(2);
                            setEndJourney(station.place_id)
                            Tts.setDefaultLanguage('en-US');
                            Tts.setDefaultRate(0.5);
                            Tts.speak(`You have arrived at ${data.data.name}`);
                            Vibration.vibrate(300)
                            mapRef?.current?.animateToRegion({
                                latitude: data.data.location.coordinates[1],
                                longitude: data.data.location.coordinates[0],
                                latitudeDelta: 0.0022,
                                longitudeDelta: 0.0022,
                            }, 800)
                            break;
                        }
                        catch (error) {
                            console.error("Error fetching station data:", error);
                        }
                    }
                }
            }
            catch (error: any) {
                console.log('No Location for continuous polling', error.code);
            }
        };

        const intervalId = setInterval(updateLocation, 10000);

        return () => clearInterval(intervalId);
    }, [allStations, endJourney]);

    const MapMarker = ({ station }: MapMarker) => {
        if (visibleStation.length > 0 && visibleStation.includes(station._id)) {
            return (
                <Marker anchor={{ x: 0.5, y: 0.5 }} style={{backgroundColor: "red", width: 100, height: 100}} onPress={() => handleBottomSheet(station._id)} coordinate={{ latitude: station.location.coordinates[1], longitude: station.location.coordinates[0] }} >
                    <View style={styles.markerContainer}>
                        <View style={[styles.infoContainer, { backgroundColor: station.cng_available == 1 ? "#70e000" : (station.cng_available == 2 ? "#ffb703" : (station.cng_available == 3 ? "#ff4d6d" : "white")) }]}>
                            <Text style={styles.infoText}>Cars: {station.queue != "nil" ? station.queue : "--"}</Text>
                        </View>
                        <Image source={require('../assets/gas_station_icon.png')} style={styles.icon} />
                    </View>
                </Marker>
            )
        }
        if (visibleStation.length < 1) {
            return (
                <Marker anchor={{ x: 0.5, y: 0.5 }} onPress={() => handleBottomSheet(station._id)} coordinate={{ latitude: station.location.coordinates[1], longitude: station.location.coordinates[0] }} >
                    <View style={styles.markerContainer}>
                        <View style={[styles.infoContainer, { backgroundColor: station.cng_available == 1 ? "#70e000" : (station.cng_available == 2 ? "#ffb703" : (station.cng_available == 3 ? "#ff4d6d" : "white")) }]}>
                            <Text style={styles.infoText}>Cars: {station.queue != "nil" ? station.queue : "--"}</Text>
                        </View>
                        <Image source={require('../assets/gas_station_icon.png')} style={styles.icon} />
                    </View>
                </Marker>
            )
        }
    }

    useEffect(() => {
        PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION').then(permission => {
            requestLocationPermission(permission)
        })

        if (isConnected) {
            fetch(`${domain}/station/getAllStations`).then(res => res.json())
            .then(data => {
                setAllStations(data.data)
            })
        }
    }, [])

    useEffect(() => {
        if (currLocation != null) {
            if (filterType == "") {
                mapRef?.current?.animateToRegion({
                    latitude: currLocation.lat,
                    longitude: currLocation.lng,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.0022,
                }, 800)
            }
        }
        else {
            let isFetching = true;
            Geolocation.getCurrentPosition(
                (response) => {
                    const {latitude, longitude} = response.coords;
                    setCurrLocation({ lat: latitude, lng: longitude })
                },
                (error) => {
                    if (error.code == 2) {
                        isFetching = false
                        Snackbar.show({
                            text: "Location is off",
                            backgroundColor: "red",
                            duration: Snackbar.LENGTH_LONG
                        })
                    }
                }
            )
            if (isFetching) {
                Snackbar.show({
                    text: "Getting current location, wait....",
                    backgroundColor: "#2196f3",
                    duration: Snackbar.LENGTH_SHORT
                })
            }
        }
    }, [currLocation])

    const requestLocationPermission = async (permission: boolean) => {
        if (Platform.OS == "android" && !permission) {
            PermissionsAndroid.request(
                'android.permission.ACCESS_FINE_LOCATION',
                {
                    title: "Location Permission",
                    message: "This app needs access to your location",
                    buttonNeutral: "Ask me later",
                    buttonPositive: "Ok",
                    buttonNegative: "Cancel"
                }
            )
            .then((granted) => {
                console.log(granted);
                if (granted == "granted") {
                    getCurrentLocation()
                    return;
                }
                else {
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
            })
        }
        else if (Platform.OS == "android" && permission) {
            getCurrentLocation()
        }
    }

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                Snackbar.show({
                    text: "Getting current location....",
                    backgroundColor: "#2196f3",
                    duration: Snackbar.LENGTH_SHORT
                })
                const { latitude, longitude } = position.coords
                setCurrLocation({ lat: latitude, lng: longitude })
            },
            (error) => {
                if (error.code == 2) {
                    enableLocationServices()
                }
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        )
    }
    const enableLocationServices = () => {
        Alert.alert(
            "Enable Location",
            "Please turn on location to use this app",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Ok", style: "default" }
            ],
            { cancelable: false }
        )
    }
    const handleBottomSheet = async (stationId: string) => {
        setIsMyLocBtnHidden(true)
        setStationData(undefined);
        setSnapIndex(1);
        const res = await fetch(`${domain}/station/getStationById/${stationId}`);
        const data = await res.json();
        setStationData(data.data);
    }

    return (
        <View style={styles.container}>
            <MapView
                showsCompass={false}
                mapType='standard'
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 20.5937,
                    longitude: 78.9629,
                    latitudeDelta: 11.5,
                    longitudeDelta: 11.5,
                }}
                showsUserLocation={currLocation != null ? true : false}
                showsMyLocationButton={false}>
                {allStations && allStations.map((station: Station) => (
                    <MapMarker station={station} key={`${station._id}-${station.cng_available}-${station.queue}`} />
                ))}
                <Polyline strokeColor='#0f53ff' strokeWidth={6} coordinates={routeInfo.routeCoords} />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    infoContainer: {
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 0.5,
    },
    infoText: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 12,
    },
    markerContainer: {
        alignItems: 'center',
    },
    icon: {
        width: 32,
        height: 32,
    },
});
