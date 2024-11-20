import Geolocation from "@react-native-community/geolocation"

export const domain = "http://192.168.1.37:3000"

export const getLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        )
    })
}