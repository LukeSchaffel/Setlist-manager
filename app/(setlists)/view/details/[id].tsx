import { Text } from '@/components'
import { Stack, useLocalSearchParams } from 'expo-router'

const DetailsPage = () => {
	const { id } = useLocalSearchParams()
	return <Text> Details page</Text>
}

export default DetailsPage
