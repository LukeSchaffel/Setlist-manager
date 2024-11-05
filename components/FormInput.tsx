import { useForm, Controller, Control, RegisterOptions } from 'react-hook-form'
import { TextInput, TextInputProps } from 'react-native-paper'

interface IFormInputProps {
	control: Control<any>
	inputProps?: TextInputProps
	name: string
	label: string
	rules?: RegisterOptions<any>
}

const FormInput = ({ control, inputProps, name, label, rules }: IFormInputProps) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<TextInput mode="outlined" label={label} value={value} onChangeText={onChange} {...inputProps} />
			)}
		/>
	)
}

export default FormInput
