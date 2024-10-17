import { Pressable } from 'react-native'
import { ReactNode } from 'react'
import { Text } from './Themed'

interface IButtonProps {
	children?: ReactNode
}

const Button = ({}: IButtonProps) => {
	return <Pressable>{({ pressed }) => <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>}</Pressable>
}
