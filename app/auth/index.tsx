import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { push, ref, set } from 'firebase/database'
import { Redirect, router } from 'expo-router'

import { Text, View, Button, Input, Divider } from '@/components'
import { AppContext, auth, db } from '@/app/_layout'
import {
	signInWithEmailAndPassword,
	getAuth,
	getReactNativePersistence,
	User,
	createUserWithEmailAndPassword,
} from 'firebase/auth'

const AuthScreen = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { user } = useContext(AppContext)
	const [page, setPage] = useState<'signup' | 'login'>('login')

	const handleCreateAccount = async () => {
		try {
			const response = await createUserWithEmailAndPassword(auth, email, password)
			const user = response.user
			set(ref(db, '/users/' + user.uid), {
				email,
			})
			router.replace('/')
		} catch (error) {
			Alert.alert('Something went wrong')
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

	if (user) {
		return <Redirect href="/(setlists)" />
	}

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>{page === 'login' ? 'Login' : 'Sign Up'}</Text>
				<Divider full />
			</View>
			<View>
				<Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
				<Input.Password label="Password" value={password} onChangeText={setPassword} />
			</View>
			<View>
				{page === 'signup' ? (
					<>
						<Button.Primary onPress={handleCreateAccount}>Create account</Button.Primary>
						<Button onPress={() => setPage('login')}>Already have an account?</Button>
					</>
				) : (
					<>
						<Button.Primary onPress={login}>Login</Button.Primary>
						<Button.Link onPress={() => setPage('signup')}>Create account</Button.Link>
					</>
				)}
			</View>
		</View>
	)
}

export default AuthScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		gap: 16,
		justifyContent: 'space-evenly',
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
