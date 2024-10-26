import { Alert, StyleSheet } from 'react-native'
import dayjs from 'dayjs'
import { useForm, Controller } from 'react-hook-form'
import { push, ref, update } from 'firebase/database'
import { Link, router } from 'expo-router'

import { Text, View } from '@/components'
import { Input, DatePickerFormItem, Button } from '@/components'
import { db, auth } from '../../_layout'

export default function CreateSetlistScreen() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			date: new Date(),
			location: '',
		},
	})

	const onSubmit = async (data: any) => {
		try {
			if (!auth.currentUser) throw new Error('No user')
			const newSetlistRef = await push(ref(db, 'setlists'))
			const newSetlistId = newSetlistRef.key

			const setlistData = {
				date: dayjs(data.date).toISOString(),
				name: data.name,
				owner: auth.currentUser.uid,
				location: data.location,
			}

			const updates: any = {}
			updates[`/setlists/${newSetlistId}`] = setlistData
			updates[`/users/${auth.currentUser.uid}/setlists/${newSetlistId}`] = true

			await update(ref(db), updates)

			router.replace(`/setlists/${newSetlistId}`)
			router.push(`/setlists/${newSetlistId}/add-song`)
		} catch (error) {
			Alert.alert('Something went wrong')
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create new set list</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<View style={styles.form}>
				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input label="Name" value={value} onChangeText={onChange} onBlur={onBlur} />
					)}
					name="name"
					rules={{ required: 'Name is required' }}
				/>
				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input label="Location" value={value} onChangeText={onChange} onBlur={onBlur} />
					)}
					name="location"
					rules={{ required: 'Location is required' }}
				/>
				{errors.name && <Text lightColor="red">This is required.</Text>}
				<DatePickerFormItem control={control} />
				<Button.Primary onPress={handleSubmit(onSubmit)}>Submit</Button.Primary>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	form: {
		flex: 1,
		gap: 16,
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
