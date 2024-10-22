import { Stack } from 'expo-router'
import { Modal } from 'react-native'

const CreateLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
		</Stack>
	)
}

export default CreateLayout
