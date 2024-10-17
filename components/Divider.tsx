import { StyleSheet, ViewProps } from 'react-native'
import { View } from './Themed'

const Divider = (props: ViewProps & { full?: boolean }) => {
	return (
		<View
			style={[styles.separator, { width: props.full ? '100%' : '80%' }]}
			lightColor="#eee"
			darkColor="rgba(255,255,255,0.1)"
			{...props}
		/>
	)
}

export default Divider

const styles = StyleSheet.create({
	separator: {
		marginVertical: 30,
		height: 1,
	},
})
