import React, { useContext, useState } from 'react'
import { StyleSheet, Button, Alert } from 'react-native'

import { Text, View } from '@/components/Themed'
import { Input } from '@/components'
import { AppContext, handleCreateAccount } from '@/app/_layout'
import { signInWithEmailAndPassword, getAuth, getReactNativePersistence } from 'firebase/auth'
import { Redirect, router } from 'expo-router'

const AuthScreen = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { setUser } = useContext(AppContext)
	const [page, setPage] = useState<'signup' | 'login'>('signup')

	const createAccount = () => {
		if (email && password) {
			handleCreateAccount(email, password, (createdUser) => setUser(createdUser))
		}
	}

	const login = () => {
		if (email && password) {
			const auth = getAuth()
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// Signed int
					const user = userCredential.user
					if (user) {
						router.replace('/')
					}
					// ...
				})
				.catch((error) => {
					Alert.alert('Error', error.message)
				})
		}
	}

	if (getAuth().currentUser) {
		return <Redirect href="/(tabs)" />
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{page === 'login' ? 'Login' : 'Sign Up'}</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
			<Input.Password label="Password" value={password} onChangeText={setPassword} />
			{page === 'signup' ? (
				<>
					<Button title="Create account" onPress={createAccount} />
					<Button title="Already have an account?" onPress={() => setPage('login')} />
				</>
			) : (
				<>
					<Button title="Login" onPress={login} />
					<Button title="Dont have an account yet?" onPress={() => setPage('signup')} />
				</>
			)}
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
