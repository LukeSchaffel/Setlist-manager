import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import { createContext } from 'react'
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper'
import merge from 'deepmerge'

import { firebaseConfig } from '@/firebaseConfig'
import { useColorScheme } from '@/components/useColorScheme'
import { initializeApp } from 'firebase/app'
import { getAuth, initializeAuth, onAuthStateChanged, User } from 'firebase/auth'
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getDatabase } from 'firebase/database'
import { darkTheme, lightTheme } from '@/constants/Colors'

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
	user: User | null
	[key: string]: any
}

export const AppContext = createContext<IAppContext>({ user: null })

const customDarkTheme = { ...MD3DarkTheme, colors: darkTheme.colors }
const customLightTheme = { ...MD3LightTheme, colors: lightTheme.colors }

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: NavigationDefaultTheme,
	reactNavigationDark: NavigationDarkTheme,
})

const CombinedLightTheme = merge(LightTheme, customLightTheme)
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme)

function RootLayoutNav() {
	const colorScheme = useColorScheme()
	const paperTheme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme

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
			<ThemeProvider value={paperTheme}>
				<PaperProvider theme={{ ...paperTheme, roundness: 2 }}>
					<Stack>
						<Stack.Screen name="(home)" options={{ headerShown: false }} />
						<Stack.Screen name="auth" options={{ headerShown: false }} />
					</Stack>
				</PaperProvider>
			</ThemeProvider>
		</AppContext.Provider>
	)
}
