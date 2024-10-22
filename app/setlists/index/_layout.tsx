import { Stack } from 'expo-router'

const SetlistsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false, title: 'My setlists ' }} />
			<Stack.Screen name="[id]/index" options={{ title: '' }} />
			<Stack.Screen
				name="[id]/(songs)/add-song"
				options={{ presentation: 'modal', title: 'Add a song to this setlist' }}
			/>
		</Stack>
	)
}

export default SetlistsLayout
