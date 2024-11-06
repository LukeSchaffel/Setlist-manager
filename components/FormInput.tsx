import { useForm, Controller, Control, RegisterOptions } from 'react-hook-form'
import { TextInput, TextInputProps } from 'react-native-paper'

interface IFormInputProps {
	control: Control<any>
	inputProps?: TextInputProps
	name: string
	label: string
	rules?: RegisterOptions<any>
	onChangeText?: (value: any, onChange: any) => any
}

const FormInput = ({ control, inputProps, name, label, rules, onChangeText }: IFormInputProps) => {
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

const Number = ({ control, inputProps, name, label, rules, onChangeText }: IFormInputProps) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<TextInput
					mode="outlined"
					label={label}
					value={value}
					onChangeText={(value) => {
						if (!isNaN(parseInt(value)) || value === '') {
							onChange(value)
						}
					}}
					{...inputProps}
				/>
			)}
		/>
	)
}

FormInput.Number = Number

export default FormInput
