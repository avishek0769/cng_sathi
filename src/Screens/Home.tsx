import { Alert, Animated, BackHandler, Easing, Image, Keyboard, KeyboardAvoidingView, Linking, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import BottomSheetComp from '../Components/BottomSheet'
import { AppContext } from '../Context'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Map from '../Components/Map'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ScreenParamList, socket } from '../App'
import NoInternet from '../Components/NoInternet'
import Snackbar from 'react-native-snackbar'
import Geolocation from '@react-native-community/geolocation'
import SearchCards from '../Components/SearchCards'
import { domain, getLocation } from '../constants'
import Loading from '../Components/Loading'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FlashMessage from 'react-native-flash-message'

export type HomeScreenNavigationProp = NativeStackScreenProps<ScreenParamList, "Home">

export default function Home({ navigation, route }: HomeScreenNavigationProp) {
    const { bottomSheetRef, isMyLocBtnHidden, mapRef, allStations, setAllStations, currLocation, isConnected, setCurrLocation, setIsMyLocBtnHidden, accessToken, currentUser, setVisibleStation, visibleStation, filterType, setFilterType, setStationData, setRouteInfo, setSnapIndex, setCurrentUser, setAccessToken } = useContext(AppContext)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const drawerPosition = useRef(new Animated.Value(0)).current;
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [bestOptionStations, setBestOptionStations] = useState<any[]>([]);
    const [currentIndexOfBestOption, setCurrentIndexOfBestOption] = useState(-99)
    const messRef = useRef<FlashMessage>(null)
    const allStationsRef = useRef<any[]>([]);

    useEffect(() => {
        allStationsRef.current = allStations;
    }, [allStations]);

    const centerMyLocation = async () => {
        if (currLocation != null) {
            mapRef?.current?.animateToRegion({
                latitude: currLocation.lat,
                longitude: currLocation.lng,
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0022,
            }, 800)
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
                    else if (error.code === 1) {
                        isFetching = false
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
            )
            if (isFetching) {
                Snackbar.show({
                    text: "Getting current location, wait....",
                    backgroundColor: "#2196f3",
                    duration: Snackbar.LENGTH_SHORT
                })
            }
        }
    }
    const openDrawer = () => {
        setIsMyLocBtnHidden(true)
        setDrawerOpen(true);
        Animated.timing(drawerPosition, {
            toValue: 1,
            duration: 400,  // Adjust for speed
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),  // Smooth easing function
        }).start();
    };
    const closeDrawer = () => {
        setInput("")
        setIsMyLocBtnHidden(false)
        Keyboard.dismiss();
        Animated.timing(drawerPosition, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.in(Easing.exp),
        }).start(() => setDrawerOpen(false));
    };
    // Top Drawer open/close useEffect
    useEffect(() => {
        const backAction = () => {
            if (isDrawerOpen) {
                closeDrawer();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [isDrawerOpen]);
    useEffect(() => {
        if (!isDrawerOpen) {
            closeDrawer()
        }
    }, [isDrawerOpen])
    const drawerTranslateY = drawerPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [-600, 0],
    });
    // Fetch on the basis of Seacrh input 
    useEffect(() => {
        if (input != "") {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                fetch(`${domain}/station/searchStation?input=${input}`).then(res => res.json())
                    .then(data => {
                        setSearchResults(data.data);
                    })
            }, 700)
        }
        else {
            setSearchResults([]);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [input])

    useEffect(() => {
        if (currentIndexOfBestOption != -99) {
            setStationData(bestOptionStations[currentIndexOfBestOption])
            mapRef?.current?.animateCamera({
                center: {
                    latitude: bestOptionStations[currentIndexOfBestOption].location.coordinates[1],
                    longitude: bestOptionStations[currentIndexOfBestOption].location.coordinates[0]
                },
                zoom: 14
            }, { duration: 800 })
            setVisibleStation([bestOptionStations[currentIndexOfBestOption]._id])
        }
    }, [currentIndexOfBestOption])

    // Fetch best cng option when Location is fetched
    useEffect(() => {
        if (filterType == "bestOption" && currLocation != null && loading) {
            setIsMyLocBtnHidden(true)
            fetch(`${domain}/station/bestCngOption?lat=${currLocation?.lat}&lng=${currLocation?.lng}&maxDist=${20000}`).then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.data.length > 0) {
                    setSnapIndex(1)
                    setBestOptionStations(data.data)
                    setCurrentIndexOfBestOption(0)
                    Snackbar.show({
                        text: `Got ${data.data.length} results`,
                        backgroundColor: "#52b788"
                    })
                }
                else {
                    Snackbar.show({
                        text: "Their is no best CNG option available",
                        backgroundColor: "red"
                    })
                }
            })
        }
    }, [currLocation])

    // Get current user
    useEffect(() => {
        const refreshAccessToken = async () => {
            const item = await AsyncStorage.getItem("refreshToken")
            if (item) {
                const parsedItem = JSON.parse(item)
                if (Date.now() > parsedItem.exp) {
                    await AsyncStorage.removeItem("refreshToken")
                    setCurrentUser(undefined)
                }
                else {
                    const response = await fetch(`${domain}/user/refreshAccessToken`, {
                        headers: {
                            "Authorization": `Bearer ${parsedItem.refreshToken}`
                        }
                    })
                    if (response.status > 399) setCurrentUser(undefined);
                    else {
                        const accessToken = response.headers.get("accessToken")
                        const refreshToken = response.headers.get("refreshToken")
                        await AsyncStorage.setItem("accessToken", JSON.stringify({ accessToken, exp: Date.now() + 3 * 24 * 60 * 60 * 1000 }))
                        await AsyncStorage.setItem("refreshToken", JSON.stringify({ refreshToken, exp: Date.now() + 10 * 24 * 60 * 60 * 1000 }))
                        const data = await response.json()
                        setAccessToken(parsedItem.accessToken)
                        setCurrentUser(data.data)
                    }
                }
            }
            else {
                setCurrentUser(undefined)
            }
        }
        AsyncStorage.getItem("accessToken").then(async item => {
            if (item) {
                const parsedItem = JSON.parse(item)
                // console.log(parsedItem);
                if (Date.now() > parsedItem.exp) {
                    refreshAccessToken()
                }
                else {
                    const response = await fetch(`${domain}/user/getCurrentUser`, {
                        headers: {
                            "Authorization": `Bearer ${parsedItem.accessToken}`
                        }
                    })
                    if (response.status > 399) refreshAccessToken();
                    else {
                        const data = await response.json()
                        setAccessToken(parsedItem.accessToken)
                        setCurrentUser(data.data)
                    }
                }
            }
            else {
                refreshAccessToken()
            }
        })
    }, [])

    const cngAvailableBtn = () => {
        setSnapIndex(-1)
        bottomSheetRef?.current?.close()
        setLoading(true)
        setMessage("Finding Petrol Pumps...")
        fetch(`${domain}/station/cngAvailableStations`).then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.data.length > 0) {
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

    const handleBestCngOpt = async () => {
        if (currLocation != null) {
            setLoading(true)
            setMessage("Finding the nearest CNG available pump...");
            setFilterType("bestOption")
            setIsMyLocBtnHidden(true)
            fetch(`${domain}/station/bestCngOption?lat=${currLocation?.lat}&lng=${currLocation?.lng}&maxDist=${20000}`).then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.data.length > 0) {
                    setSnapIndex(1)
                    setBestOptionStations(data.data)
                    setCurrentIndexOfBestOption(0)
                    Snackbar.show({
                        text: `Got ${data.data.length} results`,
                        backgroundColor: "#52b788"
                    })
                }
                else {
                    Snackbar.show({
                        text: "Their is no best CNG option available",
                        backgroundColor: "red"
                    })
                }
            })
        }
        else {
            setLoading(true)
            setMessage("Finding the nearest CNG available pump...");
            try {
                const position: any = await getLocation()
                const { latitude, longitude } = position.coords;
                setFilterType("bestOption");
                setCurrLocation({ lat: latitude, lng: longitude });
            }
            catch (error: any) {
                setLoading(false)
                if (error.code === 2) {
                    Snackbar.show({
                        text: "Location is off",
                        backgroundColor: "red",
                        duration: Snackbar.LENGTH_LONG,
                    });
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
            
    }
    useEffect(() => {
        console.log("Length all the time inside UseEffect -->", allStationsRef.current.length); 
        socket.on("stationStatusUpdated", (data) => {
            console.log("Length of allStation-->", allStationsRef.current.length);
            const updatedStations = allStationsRef.current.map((station: any) => station._id == data._id ? { ...station, cng_available: data.cng_available, queue: data.queue } : station)
            console.log("Length of updated Staion --> ", updatedStations.length);
            console.log(updatedStations[data._id]);
            setAllStations(updatedStations)
        })
    }, [])

    const handleCrossFilter = () => {
        setVisibleStation([])
        setFilterType("")
        if (filterType == "cngAvailable") {

        }
        else if (filterType == "bestOption") {
            setCurrentIndexOfBestOption(-99)
            setBestOptionStations([])
        }
    }
    const handlePrevBestOption = () => {
        if (currentIndexOfBestOption <= 0) {
            Snackbar.show({
                text: "No more stations",
                backgroundColor: "red"
            })
        }
        else {
            setRouteInfo({
                distance: "",
                duration: "",
                polyline: "",
                routeCoords: []
            })
            setCurrentIndexOfBestOption(prev => prev - 1)
        }
    }
    const handleNextBestOption = () => {
        if (currentIndexOfBestOption >= bestOptionStations.length - 1) {
            Snackbar.show({
                text: "No more stations",
                backgroundColor: "red"
            })
        }
        else {
            setRouteInfo({
                distance: "",
                duration: "",
                polyline: "",
                routeCoords: []
            })
            setCurrentIndexOfBestOption(prev => prev + 1)
        }
    }

    return (
        <>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <FlashMessage position={'center'} ref={messRef} />

            <View style={styles.searchInputSection}>
                <Icon name='location-pin' style={styles.mapLogo} size={36} color={"#2196f3"} />
                <Pressable onPress={closeDrawer} style={[styles.cancelSearch]}>
                    <Icon name='cancel' color={"#212529"} size={35} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate("MyAccount")} style={[styles.userImage, isDrawerOpen && { display: "none" }]}>
                    <Image source={{ uri: currentUser?.avatar || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" }} style={{ width: 43, height: 43 }} />
                </Pressable>
                <TextInput onChangeText={setInput} value={input} autoFocus={false} onFocus={() => {
                    setSnapIndex(-1)
                    bottomSheetRef?.current?.close()
                    openDrawer()
                }} style={[styles.searchInput, isDrawerOpen && { backgroundColor: "#e9ecef" }]} placeholder='Search petrol pumps' placeholderTextColor={"#343a40"} />
            </View>

            <ScrollView horizontal style={[styles.options, isDrawerOpen && { display: "none" }]} contentContainerStyle={{ paddingRight: 16 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                <Pressable onPress={cngAvailableBtn} style={[styles.optionBtns, { backgroundColor: filterType == "cngAvailable" ? "#e9ecef" : "white" }]}>
                    <Icon name='local-gas-station' size={19} color={"#555555"} />
                    <Text style={styles.optionBtnTxt}>CNG Available pumps</Text>
                </Pressable>
                <Pressable onPress={handleBestCngOpt} style={[styles.optionBtns, { backgroundColor: filterType == "bestOption" ? "#e9ecef" : "white" }]}>
                    <Icon name='local-gas-station' size={19} color={"#555555"} />
                    <Text style={styles.optionBtnTxt}>Best CNG Option</Text>
                </Pressable>
            </ScrollView>

            <TouchableOpacity onPress={handlePrevBestOption} style={{ position: "absolute", borderRadius: 100, bottom: 260, left: 20, zIndex: 100, padding: 8, backgroundColor: "#f8f9fa", display: filterType == "bestOption" ? "flex" : "none" }}>
                <Icon name='keyboard-double-arrow-left' size={40} color={"#2196f3"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextBestOption} style={{ position: "absolute", borderRadius: 100, bottom: 260, right: 20, zIndex: 100, padding: 8, backgroundColor: "#f8f9fa", display: filterType == "bestOption" ? "flex" : "none" }}>
                <Icon name='keyboard-double-arrow-right' size={40} color={"#2196f3"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCrossFilter} style={[styles.crossFilterBtn, ((!isMyLocBtnHidden && filterType == "") || (isMyLocBtnHidden)) ? { display: "none" } : null]}>
                <Icon name='cancel' size={57} />
            </TouchableOpacity>
            <TouchableOpacity onPress={centerMyLocation} style={[styles.myLocationBtn, isMyLocBtnHidden ? { display: "none" } : null]}>
                <Icon name='my-location' size={35} color={"white"} />
            </TouchableOpacity>

            {isConnected ? <Map /> : <NoInternet />}

            {isDrawerOpen && (
                <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', transform: [{ translateY: drawerTranslateY }], }}>
                    <ScrollView style={{ flex: 1, borderRadius: 15, padding: 20, marginTop: 70, marginBottom: 20 }}>
                        {searchResults.length > 0 ? (
                            searchResults.map((item: any) => (
                                <SearchCards setDrawerOpen={setDrawerOpen} station={item} key={item.place_id} />
                            ))
                        ) :
                            (
                                <View style={{ top: 140, left: "50%", transform: [{ translateX: -50 }], alignItems: "center", position: "absolute" }}>
                                    <Text style={{ color: "#dee2e6", fontSize: 30, fontWeight: "600" }}>No result</Text>
                                    <Icon name="cloud-off" size={70} color="#dee2e6" />
                                </View>
                            )}
                    </ScrollView>
                </Animated.View>
            )}

            {loading && <Loading text={message} />}
            <BottomSheetComp messRef={messRef} setLoading={setLoading} bestOptionStations={bestOptionStations} navigation={navigation} route={route} />
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
        color: "#343a40",
        elevation: 6
    },
    options: {
        position: "absolute",
        flexDirection: "row",
        top: 78,
        zIndex: 100,
        paddingVertical: 8
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
        marginLeft: 12,
        elevation: 6
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
        overflow: "hidden"
    },
    cancelSearch: {
        width: 43,
        height: 43,
        borderRadius: 1000,
        position: "absolute",
        zIndex: 100,
        right: 10,
        top: 36,
    },
    mapLogo: {
        position: "absolute",
        zIndex: 1000,
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
    },
    crossFilterBtn: {
        position: "absolute",
        backgroundColor: "red",
        // padding: 12,
        borderRadius: 100,
        bottom: 90,
        right: 20,
        zIndex: 100,
    },
    iconStyleSearch: {
        borderRadius: 1000,
        backgroundColor: "#dee2e6",
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center"
    }
})