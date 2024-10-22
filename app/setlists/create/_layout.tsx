import { Stack } from 'expo-router'

const CreateLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="[id]/songs" options={{ presentation: 'modal', headerShown: false }} />
		</Stack>
	)
}

export default CreateLayout
