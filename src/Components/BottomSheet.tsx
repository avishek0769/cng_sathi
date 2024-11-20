import React, { useContext, useMemo, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { AppContext } from '../Context'
import ArrivedBottomSheet from './ArrivedBottomSheet'
import NotArrivedBottomSheet from './NotArrivedBottomSheet'
import { HomeScreenNavigationProp } from '../Screens/Home'
import DirectionBottomSheet from './DirectionBottomSheet'
import { ActivityIndicator } from 'react-native'
import FlashMessage from 'react-native-flash-message'

type BottomSheetParamList = HomeScreenNavigationProp & {
    setLoading: (loading: boolean) => void;
    bestOptionStations: any[];
    messRef: React.RefObject<FlashMessage>
}

export default function BottomSheetComp({ navigation, route, setLoading, bestOptionStations, messRef }: BottomSheetParamList): JSX.Element {
    const { bottomSheetRef, routeInfo, bottomSheetLoading, isArrived, snapIndex } = useContext(AppContext)
    const snapPoints = useMemo(() => ["29%", "60%", "83%"], [])

    const Child = () => {
        if (isArrived && routeInfo.distance.length > 0 || isArrived && routeInfo.distance.length < 1) {
            return <ArrivedBottomSheet messRef={messRef} key={String(routeInfo.distance.length)} navigation={navigation} route={route} />
        }
        else if (!isArrived && routeInfo.distance.length > 0) {
            return <DirectionBottomSheet bestOptionStations={bestOptionStations} setLoading={setLoading} />
        }
        else if(!isArrived && routeInfo.distance.length !> 0){
            return <NotArrivedBottomSheet messRef={messRef} navigation={navigation} route={route} />
        }
        else {
            return <NotArrivedBottomSheet messRef={messRef} navigation={navigation} route={route} />
        }
    }

    return (
        <BottomSheet backgroundStyle={{backgroundColor: "#f8f9fa"}} snapPoints={snapPoints} index={snapIndex} ref={bottomSheetRef} enableContentPanningGesture={true} enableOverDrag={false} keyboardBehavior="interactive" keyboardBlurBehavior="restore" >
            {bottomSheetLoading? (
                <BottomSheetView>
                    <ActivityIndicator size={40} color={"#2196f3"} style={{marginTop: 10}} />
                </BottomSheetView>
            ) : <Child />}
        </BottomSheet>
    )
}
