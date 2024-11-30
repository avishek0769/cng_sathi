import Geolocation from "@react-native-community/geolocation"

export const domain = "https://cngsathi.nexus-network.tech"

export const getLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        )
    })
}