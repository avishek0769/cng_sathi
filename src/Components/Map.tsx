import { Alert, BackHandler, Linking, PermissionsAndroid, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Geolocation from '@react-native-community/geolocation'
import { AppContext } from '../Context'
// import MapView, { Marker } from 'react-native-maps'


export default function Map() {
    const [currentLocation, setCurrentLocation] = useState<any>(null)
    const [error, setError] = useState<string>("")
    const {bottomSheetRef, setIsMyLocBtnHidden} = useContext(AppContext)

    useEffect(() => {
        requestLocationPermission()
    }, [])

    const requestLocationPermission = async () => {
        const permission = await PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION')
        // console.log("Location permission-->", permission);

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
            .then((granted)=>{
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
                            {text: "Cancel", style: "cancel"},
                            {text: "Give permission", style: "default", onPress: ()=> Linking.openSettings()}
                        ],
                        {cancelable: false}
                    )
                }
            })
        }
        else if(Platform.OS == "android" && permission) {
            getCurrentLocation()
        }
    }
    // I will ask the user 1 time to turn on the location, if he doesn't then i will not show the user's marker in the map. When they will click on "Nearest Pumps" then I will again show them alert by calling this function
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                // console.log('Fetching current Loc');
                const { latitude, longitude } = position.coords
                console.log({ latitude, longitude });
                setCurrentLocation({ latitude, longitude })
            },
            (error) => {
                if(error.code == 2){
                    enableLocationServices()
                }
                else setError(error.message)
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        )
    }
    const enableLocationServices = ()=>{
        // console.log('Alert to turn on location');
        Alert.alert(
            "Enable Location",
            "Please turn on location to use this app",
            [
                {text: "Cancel", style: "cancel"},
                {text: "Ok", style: "default"}
            ],
            {cancelable: false}
        )
    }
    const showBottomSheet = ()=>{
        bottomSheetRef?.current?.snapToIndex(1)
        setIsMyLocBtnHidden(true)
    }
    // console.log("error-->", error);
    
    return (
        // <MapView style={styles.map} initialRegion={{
        //     latitude: 37.78825,
        //     longitude: -122.4324,
        //     latitudeDelta: 0.01,
        //     longitudeDelta: 0.01,
        // }}>
        //     {locations.map(location => (
        //         <Marker
        //             key={location.id}
        //             coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        //         >
        //             <View style={styles.markerContainer}>
        //                 <Text style={styles.markerText}>{location.number}</Text>
        //             </View>
        //         </Marker>
        //     ))}
        // </MapView>
        <Pressable onPress={()=> showBottomSheet()} style={styles.map}>
            <Text>MAP</Text>
            {currentLocation && (
                <Text>{currentLocation.latitude} . {currentLocation.longitude}</Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        padding: 100
        // backgroundColor: "red"
    }
});
