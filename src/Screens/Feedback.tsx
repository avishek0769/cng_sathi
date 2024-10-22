import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function Feedback() {
    const comments = [
        {
            name: "John Doe",
            profilePic: "https://example.com/john-profile.jpg",
            comment: "This is a really insightful post. Thanks for sharing!"
        },
        {
            name: "Jane Smith",
            profilePic: "https://example.com/jane-profile.jpg",
            comment: "I totally agree with the points made in this article."
        },
        {
            name: "Alex Johnson",
            profilePic: "https://example.com/alex-profile.jpg",
            comment: "Great read! I learned a lot from this."
        },
        {
            name: "Emily Davis",
            profilePic: "https://example.com/emily-profile.jpg",
            comment: "Thanks for posting this. Looking forward to more content!"
        },
        {
            name: "Michael Brown",
            profilePic: "https://example.com/michael-profile.jpg",
            comment: "This helped clarify some things I was confused about."
        }
    ];

    return (
        <View>
            {comments.map((item, index: number) => (
                <>
                    <View key={item.name} style={{ flexDirection: "row", gap: 12, backgroundColor: "#e9ecef", borderRadius: 10, padding: 10, marginBottom: 5 }}>
                        <View>
                            <Image style={{ width: 42, height: 42, borderRadius: 1000, resizeMode: "contain" }} source={{ uri: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" }} />
                        </View>
                        <View>
                            <Text style={[styles.text, { fontSize: 17, fontWeight: "500" }]}>{item.name} </Text>
                            <Text style={[styles.text, { paddingRight: 40 }]}>{item.comment} </Text>
                        </View>
                    </View>
                    {index == comments.length - 1 && (
                        <TouchableOpacity onPress={() => { }}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                                Go to Example.com
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "black"
    },
})