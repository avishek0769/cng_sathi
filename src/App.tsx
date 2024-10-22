import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Home from './Screens/Home'
import { ContextProvider } from './Context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function App() {
  const Stack = createNativeStackNavigator()
  return (
    <GestureHandlerRootView>
      <ContextProvider>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={Home} />
        </Stack.Navigator>
      </ContextProvider>
    </GestureHandlerRootView>
  )
}
