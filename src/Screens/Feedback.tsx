import { ActivityIndicator, Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FeedbackCard from '../Components/FeedbackCard';
import { Comment } from '../Context';
import { domain } from '../constants';

type FeedbackScreenNavigationProp = NativeStackScreenProps<ScreenParamList, "Feedback">

export default function Feedback({navigation, route}: FeedbackScreenNavigationProp) {
    const [allComments, setAllComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [openMenuId, setOpenMenuId] = useState<null | string>(null); // Track which menu is open
    const [fadeAnim] = useState(new Animated.Value(0)); // Default opacity for menus

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };
    useEffect(() => {
        console.log(openMenuId);
        if (openMenuId !== null) {
            Animated.timing(fadeAnim, {
                toValue: 1, // Fade in when a menu is open
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0, // Fade out when no menu is open
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [openMenuId]);

    useEffect(() => {
        fetch(`${domain}/comment/getComment/${route.params.stationId}`).then(res => res.json())
        .then(data => {
            setLoading(false)
            setAllComments(data.data)
        })
    }, [])
    

    return (
        <View style={{paddingHorizontal: 10}}>
            <Text style={{ fontWeight: "600", color: "#2196f3", fontSize: 27, marginTop: 29, marginLeft: 10, marginBottom: 15 }}>All Comments</Text>

            {loading && <ActivityIndicator size={40} color={"#2196f3"} />}

            {allComments.map((item, index: number) => (
                <FeedbackCard setAllComments={setAllComments} fadeAnim={fadeAnim} openMenuId={openMenuId} toggleMenu={toggleMenu} key={item._id} item={item} inBottomSheet={false} />
            ))}
        </View>
    )
}
