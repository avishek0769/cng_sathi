import React, { useContext, useEffect, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Home from './Screens/Home'
import { AppContext, ContextProvider, Station } from './Context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Feedback from './Screens/Feedback'
import UpdateStatus from './Screens/UpdateStatus'
import MyAccount from './Screens/MyAccount'
import CreateSession from './Screens/CreateSession'
import ProfilePic from './Screens/ProfilePic'
import FlashMessage from 'react-native-flash-message'
import { io } from 'socket.io-client'
import { domain } from './constants'

export const socket = io(domain)

export type ScreenParamList = {
  Home: undefined;
  Feedback: {
    stationId: string
  };
  UpdateStatus: {
    messRef: React.RefObject<FlashMessage>
  };
  MyAccount: undefined;
  CreateSession: {
    signUp: boolean
  };
  ProfilePic: {
    imageUrl: string;
    fileName: string;
    fileType: string;
  },
  
}

export default function App() {
  const Stack = createNativeStackNavigator<ScreenParamList>()

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <ContextProvider>
          <Stack.Navigator initialRouteName='Home'>

            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Feedback' component={Feedback} options={{ headerShown: false }} />
            <Stack.Screen name='UpdateStatus' component={UpdateStatus} options={{ headerShown: false }} />
            <Stack.Screen name='MyAccount' component={MyAccount} options={{ headerShown: false }} />
            <Stack.Screen name='CreateSession' component={CreateSession} options={{ headerShown: false }} />
            <Stack.Screen name='ProfilePic' component={ProfilePic} options={{ headerShown: false }} />

          </Stack.Navigator>
        </ContextProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
