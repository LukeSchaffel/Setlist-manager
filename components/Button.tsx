import { Pressable, StyleSheet, View } from 'react-native'
import { ReactNode } from 'react'
import { useThemeColor } from '.'
import Text from './Text'

interface IButtonProps {
	children?: ReactNode
	fontSize?: number
	onPress: () => any
	full?: boolean
	ghost?: boolean
}

const Button = ({ onPress, full, fontSize, children, ghost }: IButtonProps) => {
	const color = useThemeColor({}, 'primary')
	const backgroundColor = useThemeColor({}, 'background')
	const fontColor = ghost ? color : 'white'
	return (
		<Pressable onPress={onPress} style={{ width: full ? '100%' : 'auto' }}>
			{({ pressed }) => (
				<View
					style={[
						styles.button,
						styles.shadow,
						{
							transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
							backgroundColor: ghost ? backgroundColor : color,
						},
					]}
				>
					<Text bold lightColor={fontColor} darkColor={fontColor} size={fontSize}>
						{children}
					</Text>
				</View>
			)}
		</Pressable>
	)
}

const Primary = ({ onPress, children }: IButtonProps) => {
	const color = useThemeColor({}, 'primary')
	return (
		<Pressable onPress={onPress} style={{ width: '100%' }}>
			{({ pressed }) => (
				<View
					style={[
						styles.button,
						styles.shadow,
						{
							transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
							backgroundColor: color,
						},
					]}
				>
					<Text bold lightColor="white" darkColor="white" size={32}>
						{children}
					</Text>
				</View>
			)}
		</Pressable>
	)
}

const Link = ({ onPress, children }: IButtonProps) => {
	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				<View
					style={[
						styles.button,
						{
							transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
						},
					]}
				>
					<Text primary bold size={16}>
						{children}
					</Text>
				</View>
			)}
		</Pressable>
	)
}

Button.Primary = Primary
Button.Link = Link

export default Button

const styles = StyleSheet.create({
	button: {
		padding: 16,
		borderRadius: 10,
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	shadow: {
		shadowColor: '#3D7068',
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 1.41, // The blur effect
		// Android Shadow (elevation)
		elevation: 2, // Controls the depth of the shadow on Android
	},
})
