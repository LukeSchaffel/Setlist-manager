import { Alert, StyleSheet } from 'react-native'
import { useContext } from 'react'
import { ref, push, update, set } from 'firebase/database'
import { useForm, Controller } from 'react-hook-form'

import { encodeEmail } from '@/utils'
import { Text, View, Input, Button } from '@/components'
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
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input label="Name" value={value} onChangeText={onChange} onBlur={onBlur} />
						)}
						name="name"
						rules={{ required: 'This is required' }}
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input label="Email" value={value} onChangeText={onChange} onBlur={onBlur} />
						)}
						name="email"
						rules={{ required: 'This is required' }}
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input label="Role/instrument" value={value} onChangeText={onChange} onBlur={onBlur} />
						)}
						name="role"
					/>
				</View>
				<View style={styles.buttons}>
					<Button.Primary onPress={handleSubmit(addMember)}>Add member</Button.Primary>
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
	},
	form: {
		gap: 16,
		paddingTop: 16,
	},
	info: {
		flex: 1,
		paddingVertical: 16,
		gap: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	buttons: {
		gap: 16,
	},
})
