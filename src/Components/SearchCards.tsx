import { Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../Context';

type SearchStationParamList = {
    station: {
        _id: string;
        name: string;
        location: {
            lat: number;
            lng: number;
            _id: string;
        };
        place_id: string;
        vicinity: string;
    }
    setDrawerOpen: (param: boolean) => void
}

export default function SearchCards({station, setDrawerOpen}: SearchStationParamList) {
    const { mapRef } = useContext(AppContext)

    const handlePress = () => {
        mapRef?.current?.animateToRegion({
            latitude: station.location.lat,
            longitude: station.location.lng,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0022,
        }, 800)
        setDrawerOpen(false)
    }

    return (
        <TouchableOpacity onPress={handlePress} style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
            <View style={styles.iconStyleSearch}>
                <Icon name='location-on' color={"#343a40"} size={23} />
            </View>
            <View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: "#212529", fontSize: 18.3, paddingRight: 50, paddingTop: 9 }}>{station.name}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: "#6c757d", fontSize: 15, marginTop: 4, paddingRight: 50, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#dee2e6" }}>{station.vicinity}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    iconStyleSearch: {
        borderRadius: 1000,
        backgroundColor: "#dee2e6",
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center"
    }
})