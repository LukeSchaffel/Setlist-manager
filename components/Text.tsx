import { Text as DefaultText, StyleProp, TextStyle, TextProps } from 'react-native'
import { useThemeColor } from './Themed'

interface ITextProps extends TextProps {
	primary?: boolean
	size?: number
	bold?: boolean
	veryBold?: boolean
	lightColor?: string
	darkColor?: string
	centered?: boolean
}

const Text = ({ style, size, lightColor, darkColor, primary, bold, centered, ...rest }: ITextProps) => {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, primary ? 'primary' : 'text')
	let fontWeight: TextStyle['fontWeight'] = 400
	let textAlign: TextStyle['textAlign']
	if (bold) {
		fontWeight = 500
	}

	if (centered) {
		textAlign = 'center'
	}

	return <DefaultText style={[{ color, fontSize: size, fontWeight, textAlign }, style]} {...rest} />
}

export default Text
