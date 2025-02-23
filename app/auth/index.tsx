import { useContext, useState } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Redirect, router } from 'expo-router'
import { TextInput, Button } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'

import { Text, View, Divider } from '@/components'
import { AppContext } from '@/app/_layout'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'

const AuthScreen = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	})
	const { user } = useContext(AppContext)
	const [showPassword, setShowPassword] = useState(false)

	const login = (data: any) => {
		const auth = getAuth()
		signInWithEmailAndPassword(auth, data.email, data.password)
			.then((userCredential) => {
				// Signed int
				const user = userCredential.user
				if (user) {
					router.replace('/setlists')
				}
				// ...
			})
			.catch((error) => {
				Alert.alert('Error', error.message)
			})
	}

	if (user) {
		return <Redirect href="/setlists" />
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title} centered>
					Welcome back
				</Text>
				<Divider full />
			</View>
			<View style={styles.body}>
				<Controller
					rules={{ required: 'Email is required' }}
					name="email"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							mode="outlined"
							label="Email"
							value={value}
							onChangeText={onChange}
							keyboardType="email-address"
						/>
					)}
				/>
				{errors.email && <Text lightColor="red">{errors.email.message}</Text>}
				<Controller
					name="password"
					control={control}
					rules={{ required: 'Password is required' }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							mode="outlined"
							label="Password"
							value={value}
							onChangeText={onChange}
							secureTextEntry={!showPassword}
							right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
						/>
					)}
				/>
				{errors.password && <Text lightColor="red">{errors.password.message}</Text>}
			</View>
			<View style={styles.actions}>
				<Button mode="contained" onPress={handleSubmit(login)}>
					Login
				</Button>
				<Button onPress={() => router.push(`/auth/sign-up`)}>Create account</Button>
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
	header: {
		flex: 1,
		justifyContent: 'center',
	},
	body: {
		flex: 1,
	},
	actions: {},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
})
