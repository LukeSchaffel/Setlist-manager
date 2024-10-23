import { StyleSheet } from 'react-native'

import { Text, View } from '@/components'
import { Redirect } from 'expo-router'

const LandingPage = () => {

  return <Redirect href={'/setlists'}/>


	return <View style={styles.page}></View>
}

export default LandingPage

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
})
