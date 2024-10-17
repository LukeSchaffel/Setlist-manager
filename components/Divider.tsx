import { StyleSheet, ViewProps } from 'react-native'
import { View } from './Themed'

const Divider = (props: ViewProps) => {
	return <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" {...props} />
}

export default Divider

const styles = StyleSheet.create({
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
})
