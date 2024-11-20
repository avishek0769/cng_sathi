import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ScreenParamList } from '../App'
import Loading from '../Components/Loading'
import { domain } from '../constants.js'
import { AppContext } from "../Context.tsx"
import Snackbar from 'react-native-snackbar'

type ProfilePicNavigationProp = NativeStackScreenProps<ScreenParamList, "ProfilePic">

export default function ProfilePic({ navigation, route }: ProfilePicNavigationProp) {
    const { imageUrl, fileName, fileType } = route.params;
    const [loading, setLoading] = useState<boolean>(false)
    const { setCurrentUser, currentUser, accessToken } = useContext(AppContext)

    const handleSave = async () => {
        // if (accessToken) {
        //     setLoading(true)
        //     try {
        //         const formData = new FormData();
        //         formData.append('image', {
        //             uri: imageUrl,
        //             name: fileName,
        //             type: fileType,
        //         });
        //         const res = await fetch(`${domain}/user/uploadAvatar`, {
        //             method: 'POST',
        //             headers: {
        //                 // 'Content-Type': 'multipart/form-data',
        //                 'Authorization': `Bearer ${accessToken}`
        //             },
        //             body: formData,
        //         })
        //         const data = await res.json()
        //         console.log(data);
        //         // setCurrentUser({ ...currentUser!, avatar: data.data })
        //         navigation.goBack()
        //     }
        //     catch (error) {
        //         console.error('Error uploading image:', error);
        //     }
        // }
    }

    const handleCancel = () => {
        navigation.goBack()
    }

    return (
        <View style={{ backgroundColor: "black", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Image style={{ width: 330, height: 330, borderRadius: 1000, borderWidth: 1, borderColor: "#212529" }} source={{ uri: imageUrl }} />
            <View style={{ flexDirection: "row", gap: 50, marginTop: 40 }}>
                <TouchableOpacity onPress={handleCancel} style={{ paddingHorizontal: 26, paddingVertical: 9, borderRadius: 1000, backgroundColor: "#212529" }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={{ paddingHorizontal: 26, paddingVertical: 9, borderRadius: 1000, backgroundColor: "#2196f3" }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>Save</Text>
                </TouchableOpacity>
            </View>

            {loading && <Loading text='Please wait...' />}
        </View>
    )
}

const styles = StyleSheet.create({})