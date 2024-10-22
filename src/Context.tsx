import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, FC, PropsWithChildren, RefObject, useRef, useState } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';

type ContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    bottomSheetRef: RefObject<BottomSheet> | null;
    isMyLocBtnHidden: boolean;
    setIsMyLocBtnHidden: (isMyLocBtnHidden: boolean) => void
}

export const AppContext = createContext<ContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    bottomSheetRef: null,
    isMyLocBtnHidden: false,
    setIsMyLocBtnHidden: () => {}
})

export const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const [isMyLocBtnHidden, setIsMyLocBtnHidden] = useState<boolean>(false)

    const defaultValue = {
        isLoggedIn,
        setIsLoggedIn,
        bottomSheetRef,
        isMyLocBtnHidden,
        setIsMyLocBtnHidden
    }

    return (
        <AppContext.Provider value={defaultValue}>
            {children}
        </AppContext.Provider>
    )
}

const styles = StyleSheet.create({})