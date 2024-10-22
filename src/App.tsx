import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Home from './Screens/Home'
import { ContextProvider } from './Context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  const Stack = createNativeStackNavigator()
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <ContextProvider>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} />
          </Stack.Navigator>
        </ContextProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
