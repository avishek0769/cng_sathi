import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import Report from '../Components/Report'
import { AppContext } from '../Context'
import NoAccount from '../Components/NoAccount'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ScreenParamList } from '../App'
import { domain } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../Components/Loading'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { launchImageLibrary } from 'react-native-image-picker'
import Snackbar from 'react-native-snackbar'

export type MyAccountParamList = NativeStackScreenProps<ScreenParamList, "MyAccount">

export default function MyAccount({ navigation, route }: MyAccountParamList) {
    const [loading, setLoading] = useState<boolean>(false)
    const { currentUser, setCurrentUser } = useContext(AppContext)
    
    let trustScore = 0;
    if (currentUser) {
        trustScore = ((currentUser.totalUpdates - currentUser.falseUpdates) / currentUser.totalUpdates) * 100
    }
    // AsyncStorage.removeItem("accessToken")
    // AsyncStorage.getItem("accessToken").then((item)=>{
    //     console.log(item);
    // })
    // AsyncStorage.getItem("refreshToken").then((item)=>{
    //     console.log(item);
    // })
    const handleLogOut = async () => {
        setLoading(true)
        const response = await fetch(`${domain}/api/v1/user/logout`)
        await AsyncStorage.clear()
        setLoading(false)
        setCurrentUser(undefined)
        navigation.goBack()
    }

    const handleImagePicker = () =>{
        Snackbar.show({
            text: "This feature will be available soon...😊",
            backgroundColor: "#2196f3",
            duration: Snackbar.LENGTH_LONG
        })
        // launchImageLibrary(
        //     {mediaType: "photo"},
        //     (response) => {
        //         if(response.didCancel){
        //             console.log("User canceled !");
        //         }
        //         else if(response.errorCode){
        //             console.log(response.errorCode);
        //         }
        //         else if(response){
        //             console.log(response.assets![0].fileSize!)
        //             const imageUrl = response.assets![0].uri!
        //             const fileName = response.assets![0].fileName!;
        //             const fileType = response.assets![0].type!;
                    
        //             navigation.navigate("ProfilePic", {
        //                 fileName,
        //                 fileType,
        //                 imageUrl
        //             })
        //         }
        //     }
        // )
    }

    return currentUser ? (
        <View style={{ height: "100%" }}>
            <StatusBar translucent={true} backgroundColor="transparent" />
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-around", alignItems: "baseline" }}>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: "red", borderRadius: 7, paddingHorizontal: 20, height: 40, justifyContent: "center" }} onPress={handleLogOut}>
                    <Text style={{ color: "red", fontSize: 16 }}>Log out</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Your Account</Text>
            </View>

            <View style={{ position: "relative", padding: 10, borderRadius: 6, backgroundColor: "#e9ecef", margin: 10, flexDirection: "row" }}>
                <Image style={{ width: 100, height: 100, borderRadius: 1000, resizeMode: "cover" }} source={{ uri: currentUser.avatar }} />
                <TouchableOpacity style={{position: "absolute", zIndex: 1000, left: 80, bottom: 7, borderRadius: 1000, backgroundColor: "#2196f3", padding: 5}} onPress={handleImagePicker}>
                    <Icon name='camera-alt' size={18} color={"white"} />
                </TouchableOpacity>

                <View style={{ marginLeft: 15, justifyContent: "center" }}>
                    <Text style={{ color: "black", fontSize: 23, fontWeight: "500" }}>{currentUser.fullname}</Text>
                    <Text style={{ color: "black", fontSize: 18 }}>{currentUser.username}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: "black", fontSize: 18 }}>Trust score : </Text>
                        <Text style={{ color: "black", fontSize: 18, fontWeight: "600", letterSpacing: 1.3 }}>{isNaN(trustScore) ? 0 : trustScore} %</Text>
                    </View>
                </View>
            </View>

            <Text style={{ color: "#ef233c", opacity: 0.8, fontWeight: "600", fontSize: 20, marginLeft: 18, marginBottom: 10 }}>Reports</Text>

            {currentUser.reports.length > 0 ? currentUser.reports.map(report => (
                <Report report={report} />
            )) :
            (
                <Text style={{ color: "gray", textAlign: "center", fontSize: 16 }}>No Reports</Text>
            )}

            {loading && <Loading text='Logging you out...' />}
        </View>
    ) :
    (
        <NoAccount navigation={navigation} route={route} />
    )
}

const styles = StyleSheet.create({
    heading: {
        color: "#2196f3",
        marginTop: 28,
        fontSize: 30,
        fontWeight: "600"
    },
})