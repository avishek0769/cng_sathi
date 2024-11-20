import { Animated, Image, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { AppContext, Comment } from '../Context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { domain } from '../constants'

type FeedbackCardParamList = {
    item: Comment;
    inBottomSheet: boolean;
    toggleMenu: any;
    openMenuId: any;
    fadeAnim: any;
    setAllComments?: any;
}

export default function FeedbackCard({ item, inBottomSheet, toggleMenu, openMenuId, fadeAnim, setAllComments }: FeedbackCardParamList) {
    const { currentUser, accessToken, stationData, setStationData } = useContext(AppContext)
    const [editable, setEditable] = useState<boolean>(false)
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
    const [commentSending, setCommentSending] = useState<boolean>(false)
    const [value, setValue] = useState(item.comment)
    const inputRef = useRef<TextInput>(null)

    useEffect(() => {
        Keyboard.addListener("keyboardDidHide", ()=>{
            setEditable(false)
            console.log('Hidden');
        })

        return () => Keyboard.removeAllListeners("keyboardDidHide")
    }, [])
    
    const sendEditedComment = async () => {
        Keyboard.dismiss()
        setCommentSending(true)
        const res = await fetch(`${domain}/comment/edit`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                commentId: item._id,
                message: value
            })
        })
        setEditable(false)
        setCommentSending(false)
    }
    const hanldeCommentEdit = async () => {
        toggleMenu(item._id)
        setEditable(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleCommentDelete = async (isViewAll: boolean) => {
        toggleMenu(item._id)
        setDeleteLoading(true)
        const res = await fetch(`${domain}/comment/delete/${item._id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            }
        })
        if(isViewAll){
            let comments = stationData!.comments.filter(comment => item._id != comment._id);
            setStationData({...stationData!, comments})
            setAllComments((prev: any) => prev.filter((comment: Comment) => item._id != comment._id))
        }
        else{
            let comments = stationData!.comments.filter(comment => item._id != comment._id);
            setStationData({...stationData!, comments})
        }
        setDeleteLoading(false)
    }

    return inBottomSheet ? !deleteLoading? (
        <BottomSheetView key={item._id} style={styles.cardStyle}>
            <BottomSheetView>
                <Image style={{ width: 42, height: 42, borderRadius: 1000, resizeMode: "contain" }} source={{ uri: item.commenter?.avatar }} />
            </BottomSheetView>
            <BottomSheetView>
                <Text style={[{ color: "black", fontSize: 17, fontWeight: "500" }]}>{item.commenter?.fullname} </Text>
                <TextInput ref={inputRef} editable={editable} onChangeText={setValue} style={[{ color: "black", paddingRight: 34, marginBottom: 5, fontSize: 15, height: 26, padding: 0 }]} value={value} />
            </BottomSheetView>
            <TouchableOpacity onPress={() => toggleMenu(item._id)} style={{ position: "absolute", right: 0, top: 24, display: item.commenter._id != currentUser?._id? "none" : "flex" }}>
                <Icon size={28} name='more-vert' color={"black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendEditedComment} style={{position: "absolute", top: 27, right: 30, display: editable? "flex" : "none" }}>
                { commentSending? <ActivityIndicator size={27} color={"#2196f3"} /> : <Icon name='send' size={23} color={"#2196f3"} /> }
            </TouchableOpacity>

            {openMenuId === item._id && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: 30,
                        opacity: fadeAnim, // Only the clicked menu fades in
                        backgroundColor: 'white',
                        borderRadius: 8,
                        overflow: "hidden",
                        elevation: 5,
                    }}
                >
                    <TouchableOpacity onPress={hanldeCommentEdit} style={[styles.options, { paddingTop: 10 }]}>
                        <Icon name='edit' color={"#2196f3"} size={26} />
                        <Text style={{ color: "black", fontSize: 16 }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCommentDelete(false)} style={[styles.options, { paddingBottom: 10 }]}>
                        <Icon name='delete' color={"#2196f3"} size={26} />
                        <Text style={{ color: "black", fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </BottomSheetView>
    ) : (
        <BottomSheetView style={{ backgroundColor: "#e9ecef", borderRadius: 10, padding: 10, marginBottom: 7}}>
            <ActivityIndicator size={30} color={"#2196f3"} style={{marginBottom: 8}} /> 
        </BottomSheetView>
    )
    :
    !deleteLoading? (
        <View key={item._id} style={styles.cardStyle}>
            <View>
                <Image style={{ width: 42, height: 42, borderRadius: 1000, resizeMode: "contain" }} source={{ uri: item.commenter?.avatar }} />
            </View>
            <View>
                <Text style={[{ color: "black", fontSize: 17, fontWeight: "500" }]}>{item.commenter?.fullname}</Text>
                <TextInput ref={inputRef} editable={editable} onChangeText={setValue} style={[{ color: "black", paddingRight: 34, marginBottom: 5, fontSize: 15, height: 26, padding: 0 }]} value={value} />
            </View>
            <TouchableOpacity onPress={() => toggleMenu(item._id)} style={{ position: "absolute", right: 0, top: 24, display: item.commenter._id != currentUser?._id? "none" : "flex" }}>
                <Icon size={28} name='more-vert' color={"black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendEditedComment} style={{position: "absolute", top: 27, right: 30, display: editable? "flex" : "none" }}>
                { commentSending? <ActivityIndicator size={27} color={"#2196f3"} /> : <Icon name='send' size={23} color={"#2196f3"} /> }
            </TouchableOpacity>
            {openMenuId === item._id && (
                <Animated.View
                style={{
                    position: 'absolute',
                    top: -40,
                    right: 30,
                    opacity: fadeAnim,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    overflow: "hidden",
                    elevation: 5,
                }}
                >
                    <TouchableOpacity onPress={hanldeCommentEdit} style={[styles.options, { paddingTop: 10 }]}>
                        <Icon name='edit' color={"#2196f3"} size={26} />
                        <Text style={{ color: "black", fontSize: 16 }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCommentDelete(true)} style={[styles.options, { paddingBottom: 10 }]}>
                        <Icon name='delete' color={"#2196f3"} size={26} />
                        <Text style={{ color: "black", fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    ) : (
        <View style={{ backgroundColor: "#e9ecef", borderRadius: 10, padding: 10, marginBottom: 7}}>
            <ActivityIndicator size={30} color={"#2196f3"} style={{marginBottom: 8}} /> 
        </View>
    )
}

const styles = StyleSheet.create({
    cardStyle: {
        position: "relative",
        flexDirection: "row",
        gap: 12,
        backgroundColor: "#e9ecef",
        borderRadius: 10,
        padding: 10,
        paddingTop: 7,
        marginBottom: 7,
    },
    options: {
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: "row",
        gap: 10
    }
})