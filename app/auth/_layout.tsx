import { Stack } from 'expo-router'

const AuthStack = () => (
	<Stack screenOptions={{ headerShown: false }}>
		<Stack.Screen name="index" />
		<Stack.Screen name="sign-up" />
	</Stack>
)

export default AuthStack
