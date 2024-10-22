import { Stack } from 'expo-router'

const SetlistsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false, title: 'My setlists ' }} />
			<Stack.Screen name="[id]/index" />
			<Stack.Screen name="[id]/(songs)/add-song" options={{ presentation: 'modal', headerShown: false }} />
		</Stack>
	)
}

export default SetlistsLayout
