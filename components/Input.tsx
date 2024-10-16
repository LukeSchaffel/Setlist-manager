import { useState, useEffect } from 'react'
import { TextInput, TextInputProps, StyleSheet, Button, Pressable } from 'react-native'
import { useThemeColor } from './Themed'

import { View, Text } from './Themed'

interface InputProps extends TextInputProps {
	lightColor?: string
	darkColor?: string
	label?: string
}

const Input = (props: InputProps) => {
	const { style, lightColor, darkColor, label, ...otherProps } = props
	const [isFocused, setIsFocused] = useState(false)
	const textColor = useThemeColor({}, 'primary')
	const lineColor = useThemeColor({}, 'dull')

	return (
		<View style={[styles.wrapper]}>
			{label && <Text style={[styles.labelText, { color: textColor }]}>{label}</Text>}
			<TextInput
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				style={[styles.input, { borderColor: lineColor }, style]}
				{...otherProps}
			/>
		</View>
	)
}

const Password = (props: InputProps) => {
	const { style, lightColor, darkColor, label, ...otherProps } = props
	const [isFocused, setIsFocused] = useState(false)
	const textColor = useThemeColor({}, 'primary')
	const lineColor = useThemeColor({}, 'dull')
	const [showPass, setShowPass] = useState(false)
	return (
		<View style={[styles.wrapper]}>
			{label && <Text style={[styles.labelText, { color: textColor }]}>{label}</Text>}
			<View>
				<TextInput
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					style={[styles.input, { borderColor: lineColor }, style]}
					secureTextEntry={!showPass}
					{...otherProps}
				/>
				<Pressable style={styles.button} onPress={() => setShowPass((prev) => !prev)}>
					<Text>{showPass ? 'Hide' : 'Show'}</Text>
				</Pressable>
			</View>
		</View>
	)
}

Input.Password = Password

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		padding: 16,
	},
	input: {
		borderBottomWidth: 1,
		height: 48,
		minWidth: 32,
		fontSize: 16,
		paddingLeft: 16,
	},
	labelText: {
		fontWeight: 'bold',
		fontSize: 16,
	},
	button: {
		position: 'absolute',
		right: 32,
		top: 16,
	},
})

export default Input
