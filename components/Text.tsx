import { Text as DefaultText, StyleProp, TextStyle, TextProps } from 'react-native'
import { useThemeColor } from './Themed'

interface ITextProps extends TextProps {
	primary?: boolean
	size?: number
	bold?: boolean
	veryBold?: boolean
	lightColor?: string
	darkColor?: string
}

const Text = ({ style, size, lightColor, darkColor, primary, bold, ...rest }: ITextProps) => {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, primary ? 'primary' : 'text')
  let fontWeight: TextStyle['fontWeight'] = 400
  if (bold) {
    fontWeight =  500
  }


	return <DefaultText style={[{ color, fontSize: size, fontWeight }, style]} {...rest} />
}


export default Text