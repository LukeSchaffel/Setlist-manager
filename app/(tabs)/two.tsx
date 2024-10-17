import { StyleSheet, FlatList } from 'react-native'

import { auth, db } from '../_layout'
import { Text, View } from '@/components/Themed'
import { useEffect, useState } from 'react'
import { get, onValue, ref } from 'firebase/database'

export default function TabTwoScreen() {
	const [setlists, setSetlists] = useState<any[]>([])

	useEffect(() => {
		const getSetlists = async () => {
			const userSetlistsRef = ref(db, '/users/' + auth.currentUser?.uid + '/setlists')
			const fetchSetlists = async (snapshot: any) => {
				if (snapshot.exists()) {
					const setlistIds = snapshot.val()
					const setlistPromises = Object.keys(setlistIds).map(async (setlistId) => {
						const setlistRef = ref(db, `setlists/${setlistId}`)
						const setlistSnapshot = await get(setlistRef)
						return { id: setlistId, ...setlistSnapshot.val() }
					})
					const setlists = await Promise.all(setlistPromises)
					setSetlists(setlists)
				} else {
					setSetlists([])
				}
			}
			const unsubscribe = onValue(userSetlistsRef, fetchSetlists)
			return () => unsubscribe()
		}
		getSetlists()
	}, [])

	const renderItem = ({ item }: { item: any }) => {
		return (
			<View>
				<Text>{JSON.stringify(item)}</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>My setlists</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<FlatList data={setlists} renderItem={renderItem} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
})
