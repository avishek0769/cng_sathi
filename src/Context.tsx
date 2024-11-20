import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, FC, PropsWithChildren, RefObject, useEffect, useRef, useState } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import MapView from 'react-native-maps';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { domain } from './constants';
import FlashMessage from 'react-native-flash-message';

export type StationLocation = {
    type: string;
    coordinates: number[];
}
export type LocationObj = {
    lat: number;
    lng: number;
}
export type Comment = {
    _id: string;
    commenter: {
        _id: string;
        fullname: string;
        username: string;
        avatar: string;
    },
    comment: string;
    station: string
}
export type Station = {
    _id: string;
    name: string;
    location: StationLocation;
    place_id: string;
    comments: Comment[];
    address: string;
    cng_available: number;
    cng_arrival_time: number;
    pressure: number;
    queue: string;
    cng_amount: number;
    updatedAt: number;
}
type DirectionsData = {
    distance: string;
    duration: string;
    polyline: string;
    routeCoords: any;
};
type CurrentUser = {
    _id: string;
    fullname: string;
    username: string;
    avatar: string;
    reports: string[];
    totalUpdates: number;
    falseUpdates: number;
}

type ContextType = {
    currentUser: CurrentUser | undefined;
    setCurrentUser: (currentUser: CurrentUser | undefined) => void;
    bottomSheetRef: RefObject<BottomSheet> | null;
    snapIndex: number;
    setSnapIndex: (snapIndex: number) => void;
    isMyLocBtnHidden: boolean;
    setIsMyLocBtnHidden: (isMyLocBtnHidden: boolean) => void;
    mapRef: RefObject<MapView> | null;
    currLocation: LocationObj | null;
    setCurrLocation: (currLocation: LocationObj) => void;
    stationData: Station | null | undefined;
    setStationData: (stationData: Station | null | undefined) => void;
    isConnected: boolean | null | undefined;
    routeInfo: DirectionsData;
    setRouteInfo: (routeInfo: DirectionsData) => void;
    visibleStation: string[];
    setVisibleStation: (visibleStation: string[]) => void;
    bottomSheetLoading: boolean;
    setBottomSheetLoading: (bottomSheetLoading: boolean) => void;
    filterType: string;
    setFilterType: (filterType: string) => void;
    isArrived: boolean;
    setIsArrived: (isArrived: boolean) => void,
    accessToken: string;
    setAccessToken: (accessToken: string) => void,
    allStations: any;
    setAllStations: (allStations: any) => void;
}

export const AppContext = createContext<ContextType>({
    currentUser: undefined,
    setCurrentUser: () => { },
    bottomSheetRef: null,
    snapIndex: -1,
    setSnapIndex: () => { },
    isMyLocBtnHidden: false,
    setIsMyLocBtnHidden: () => { },
    mapRef: null,
    currLocation: { lat: 20.5937, lng: 78.9629 },
    setCurrLocation: () => { },
    stationData: null,
    setStationData: () => { },
    isConnected: false,
    routeInfo: {
        distance: "",
        duration: "",
        polyline: "",
        routeCoords: []
    },
    setRouteInfo: () => { },
    visibleStation: [],
    setVisibleStation: () => { },
    bottomSheetLoading: false,
    setBottomSheetLoading: () => { },
    filterType: "",
    setFilterType: () => { },
    isArrived: false,
    setIsArrived: () => { },
    accessToken: "",
    setAccessToken: () => { },
    allStations: [],
    setAllStations: () => { },
})

export const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(undefined)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const [isMyLocBtnHidden, setIsMyLocBtnHidden] = useState<boolean>(false)
    const mapRef = useRef<MapView>(null)
    const [currLocation, setCurrLocation] = useState<LocationObj | null>(null)
    const [stationData, setStationData] = useState<Station | null | undefined>(undefined)
    const { isConnected } = useNetInfo()
    const [routeInfo, setRouteInfo] = useState<DirectionsData>({
        distance: "",
        duration: "",
        polyline: "",
        routeCoords: []
    })
    const [visibleStation, setVisibleStation] = useState<string[]>([])
    const [bottomSheetLoading, setBottomSheetLoading] = useState(false);
    const [filterType, setFilterType] = useState<string>("");
    const [isArrived, setIsArrived] = useState<boolean>(false)
    const [snapIndex, setSnapIndex] = useState<number>(-1)
    const [accessToken, setAccessToken] = useState<string>("")
    const [allStations, setAllStations] = useState<any>([])


    const defaultValue = {
        currentUser,
        setCurrentUser,
        bottomSheetRef,
        snapIndex,
        setSnapIndex,
        isMyLocBtnHidden,
        setIsMyLocBtnHidden,
        mapRef,
        currLocation,
        setCurrLocation,
        stationData,
        setStationData,
        isConnected,
        routeInfo,
        setRouteInfo,
        visibleStation,
        setVisibleStation,
        bottomSheetLoading,
        setBottomSheetLoading,
        filterType,
        setFilterType,
        isArrived,
        setIsArrived,
        accessToken,
        setAccessToken,
        allStations,
        setAllStations,
    }

    return (
        <AppContext.Provider value={defaultValue}>
            {children}
        </AppContext.Provider>
    )
}
