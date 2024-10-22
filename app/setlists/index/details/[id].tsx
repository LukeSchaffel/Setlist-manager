import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'

import { Text } from '@/components'
import { db } from '@/app/_layout'

const DetailsPage = () => {
	const { id } = useLocalSearchParams()
	const [setList, setSetlist] = useState<any>({})

	useEffect(() => {
		const getSetlist = async () => {
			const setlistRef = ref(db, '/setlists/' + id)
			const setlistSnapshot = await get(setlistRef)
			if (setlistSnapshot.exists()) {
				setSetlist(setlistSnapshot.val()) // Use .val() to extract the data
			} else {
				setSetlist(null) // Handle case where setlist does not exist
			}
		}
    getSetlist()
	}, [id])
	return <Text>{setList?.name}</Text>
}

export default DetailsPage
