import { useContext, useEffect } from 'react'
import { db } from '@/app/_layout'
import { get, ref, query, orderByChild, equalTo } from 'firebase/database'

import { AppContext } from '@/app/_layout'
import { Text, View } from '@/components'

const Index = () => {
	const { user } = useContext(AppContext)

	const getShares = async () => {
    const sharesRef = ref(db, '/shares');
		const snapshot = await get(query(sharesRef, orderByChild('email'), equalTo(user.email)))
    console.log(snapshot)
		const pendingShares = []

		snapshot.forEach((childSnapshot) => {
			const shareData = childSnapshot.val()
      console.log(shareData)
			if (shareData.status === 'pending') {
				// Adjusted to use 'status'
				pendingShares.push({ id: childSnapshot.key, ...shareData })
			}
		})

		console.log(pendingShares)
		return pendingShares
	}

	useEffect(() => {
		getShares()
	}, [])

	return <View></View>
}

export default Index
