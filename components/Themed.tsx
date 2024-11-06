/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from './useColorScheme'
import { useTheme } from 'react-native-paper'

type ThemeProps = {
	lightColor?: string
	darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme() ?? 'light'
	const colorFromProps = props[theme]

	if (colorFromProps) {
		return colorFromProps
	} else {
		return Colors[theme][colorName]
	}
}

export const View = (props: ViewProps) => {
	const { style, ...otherProps } = props
	const { colors } = useTheme()

	return <DefaultView style={[{ backgroundColor: colors.background }, style]} {...otherProps} />
}
