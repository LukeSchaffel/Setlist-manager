import { Button, StyleSheet } from 'react-native'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'
import { Input, DatePickerFormItem } from '@/components'
import { useForm, Controller } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function TabOneScreen() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			date: new Date(),
		},
	})

	const onSubmit = (data: any) => {
		console.log(data)
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
					rules={{ required: 'This is required' }}
				/>
				{errors.name && <Text lightColor="red">This is required.</Text>}
				<DatePickerFormItem control={control} />
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
