import { Alert, StyleSheet } from 'react-native'
import { useContext } from 'react'
import { ref, push, update, set } from 'firebase/database'
import { useForm, Controller } from 'react-hook-form'
import { Button } from 'react-native-paper'

import { Text, View, Input, FormInput } from '@/components'
import { auth, db } from '@/app/_layout'
import { SetlistsContext } from '../../_layout'

const AddMember = ({}) => {
	const { selectedSetlist } = useContext(SetlistsContext)
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			role: '',
		},
	})

	const addMember = async (data: any) => {
		try {
			if (!selectedSetlist) {
				Alert.alert('Setlist not found')
				return
			}
			if (!auth.currentUser) {
				console.log('Unauthorized')
				return
			}
			const sharesRef = ref(db, '/shares')
			const newShare = await push(sharesRef, {
				role: data.role,
				name: data.name,
				email: data.email,
				setlist: selectedSetlist.id,
				sentBy: auth.currentUser.uid,
				status: 'pending',
			})
			const updates: any = {}
			updates[`/setlists/${selectedSetlist.id}/shares/${newShare.key}`] = true
			await update(ref(db), updates)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.form}>
					<FormInput control={control} name="email" label="Email" rules={{ required: 'This is required' }} />
					<FormInput control={control} name="role" label="Role/instrument" />
				</View>
				<View style={styles.buttons}>
					<Button mode="contained" onPress={handleSubmit(addMember)}>
						Add member
					</Button>
				</View>
			</View>
		</>
	)
}

export default AddMember
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'space-between',
	},
	form: {
		gap: 16,
		paddingTop: 16,
	},
	buttons: {
		gap: 16,
	},
})
