import { StyleSheet, Button } from 'react-native'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'
import { Input } from '@/components'
import { useContext, useState } from 'react'
import { AppContext, handleCreateAccount } from '@/app/_layout'

const AuthScreen = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { setUser } = useContext(AppContext)

	const createAccount = () => {
		if (email && password) {
			handleCreateAccount(email, password, (createdUser) => setUser(createdUser))
		}
	}
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create account</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<Input label="Email" value={email} onChangeText={setEmail} />
			<Input label="Password" value={password} onChangeText={setPassword} />
			<Button title="Create account" onPress={createAccount} />
		</View>
	)
}

export default AuthScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
})
