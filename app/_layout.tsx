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
import { getAuth, initializeAuth, Auth, createUserWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth'
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getDatabase } from 'firebase/database'

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const db = getDatabase(app)

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(setlists)',
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

function RootLayoutNav() {
	const colorScheme = useColorScheme()

	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const auth = getAuth()
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user)
		})

		// Clean up the listener on unmount
		return () => unsubscribe()
	}, [])

	return (
		<AppContext.Provider value={{ user }}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="(home)" options={{ headerShown: false }} />
				</Stack>
			</ThemeProvider>
		</AppContext.Provider>
	)
}
