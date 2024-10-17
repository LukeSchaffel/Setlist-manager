import { Text as DefaultText, TextProps  } from "react-native"

interface ITextProps extends TextProps {
primary?: boolean
size?: number
bold?: boolean
veryBold?: boolean
}


const Text = () => {
  const { style, lightColor, darkColor, ...otherProps } = props
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <DefaultText style={[{ color }, style]} {...otherProps} />
}    