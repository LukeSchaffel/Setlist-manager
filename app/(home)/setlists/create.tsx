import { Alert, StyleSheet } from 'react-native'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { push, ref, update } from 'firebase/database'
import { router } from 'expo-router'
import { Button } from 'react-native-paper'

import { DatePickerFormItem, FormInput, Text, View } from '@/components'
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
			<View style={styles.form}>
				<FormInput name="name" label="Name" control={control} />
				{errors.name && <Text lightColor="red">This is required.</Text>}
				<FormInput name="location" label="Location" control={control} />
				<DatePickerFormItem control={control} />
			</View>
			<View style={styles.actions}>
				<Button mode="contained" onPress={handleSubmit(onSubmit)}>
					Submit
				</Button>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'space-between',
	},
	header: {},
	actions: {},
	form: {
		flex: 1,
		gap: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
})
