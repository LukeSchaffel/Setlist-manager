import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Redirect, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { SetStateAction, useEffect, useState } from 'react'
import 'react-native-reanimated'
import { createContext } from 'react'

import { firebaseConfig } from '@/firebaseConfig'
import { useColorScheme } from '@/components/useColorScheme'
import { initializeApp } from 'firebase/app'
import { getAuth, initializeAuth, Auth, createUserWithEmailAndPassword } from 'firebase/auth'
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	})

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return <RootLayoutNav />
}

export interface IAppContext {
	user?: any
	[key: string]: any
}

export const AppContext = createContext<IAppContext>({})

export const handleCreateAccount = (email: string, password: string, callback: (createdUser: any) => any) => {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed up
			const user = userCredential.user
			if (user) {
				callback(user)
			}
		})
		.catch((error) => {
			const errorCode = error.code
			const errorMessage = error.message
			console.log(error)
		})
}

function RootLayoutNav() {
	const colorScheme = useColorScheme()

	return (
		<AppContext.Provider value={{}}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
				</Stack>
			</ThemeProvider>
		</AppContext.Provider>
	)
}
