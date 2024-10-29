import { useContext, useState } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { ref, set } from 'firebase/database'
import { Redirect, router } from 'expo-router'
import { TextInput, Button } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'

import { Text, View, Divider } from '@/components'
import { AppContext, auth, db } from '@/app/_layout'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const AuthScreen = () => {
	const { user } = useContext(AppContext)
	const [page, setPage] = useState<'signup' | 'login'>('login')
	const [showPassword, setShowPassword] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			password2: '',
		},
	})

	const onSubmit = async (data: any) => {
		try {
			const response = await createUserWithEmailAndPassword(auth, data.email, data.password)
			const user = response.user
			set(ref(db, '/users/' + user.uid), {
				email: user.email,
			})
			router.replace('/setlists')
		} catch (error) {
			Alert.alert('Something went wrong')
		}
	}

	if (user) {
		return <Redirect href="/setlists" />
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}> Create your free account to get started</Text>
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
				<Controller
					name="password2"
					control={control}
					rules={{
						validate: (val) => {
							if (watch('password') !== val) {
								return 'Passwords must match!'
							}
						},
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							mode="outlined"
							label="Confirm password"
							value={value}
							onChangeText={onChange}
							secureTextEntry={!showPassword}
							right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
						/>
					)}
				/>
				{errors.password2 && <Text lightColor="red">{errors.password2.message}</Text>}
			</View>
			<View style={styles.actions}>
				<Button mode="contained" onPress={handleSubmit(onSubmit)}>
					Create account
				</Button>
				<Button onPress={() => router.push('/auth')}>Already have an account?</Button>
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
		justifyContent: 'space-between',
	},
	header: {
		flex: 1,
		justifyContent: 'center',
	},
	body: {
		flex: 1,
	},
	actions: {},
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
