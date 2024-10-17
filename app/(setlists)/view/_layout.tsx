import { Stack } from 'expo-router'

const SetlistsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="details/[id]" options={{ presentation: 'modal' }} />
		</Stack>
	)
}

export default SetlistsLayout
