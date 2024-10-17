import { StyleSheet, FlatList } from 'react-native'
import dayjs from 'dayjs'

import { auth, db } from '../../_layout'
import { Text, View, useThemeColor } from '@/components'
import { Divider } from '@/components'
import { useEffect, useState } from 'react'
import { get, onValue, ref } from 'firebase/database'
import { Link } from 'expo-router'

export default function TabTwoScreen() {
	const [setlists, setSetlists] = useState<any[]>([])
	const primary = useThemeColor({}, 'primary')

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
		const { name, date } = item
		const month = dayjs(date).format('MMM')
		const day = dayjs(date).format('DD')
		const year = dayjs(date).format('YYYY')
		return (
			<Link
				href={{
					pathname: '/view/details/[id]',
					params: { id: item.id },
				}}
			>
				<View style={styles.listItem}>
					<View style={[styles.listItemLeft]}>
						<View style={[styles.dateBox, { borderColor: primary }]}>
							<Text style={styles.month}>{month}</Text>
							<Text style={styles.day}>{day}</Text>
							<Text style={styles.year}> {year}</Text>
						</View>
						<View>
							<Text style={styles.titleText}>{name}</Text>
							<Text>Madison square garden</Text>
						</View>
					</View>
				</View>
			</Link>
		)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>My setlists</Text>
			<Divider />
			<FlatList ItemSeparatorComponent={() => <Divider />} data={setlists} renderItem={renderItem} />
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
	listItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	listItemLeft: {
		gap: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
	dateBox: {
		flexDirection: 'column',
		borderWidth: 1,
		borderRadius: 10,
		padding: 8,
	},
	month: {
		textAlign: 'center',
		fontSize: 14,
	},
	day: { textAlign: 'center', fontSize: 20, fontWeight: 500 },
	year: { textAlign: 'center', fontSize: 14 },
	titleText: {
		fontSize: 24,
		fontWeight: 500,
	},
	dateText: {
		fontSize: 14,
		fontWeight: 400,
	},
})
