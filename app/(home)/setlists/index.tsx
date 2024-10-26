import { StyleSheet, FlatList } from 'react-native'
import dayjs from 'dayjs'

import { AppContext, auth, db } from '../../_layout'
import { Button, Text, View, useThemeColor } from '@/components'
import { Divider } from '@/components'
import { useContext, useEffect, useState } from 'react'
import { get, onValue, ref } from 'firebase/database'
import { Link } from 'expo-router'
import { SetlistsContext } from './_layout'
import { Setlist } from './_layout'

export default function TabTwoScreen() {
	const primary = useThemeColor({}, 'primary')
	const { getSetlists, setlistsList } = useContext(SetlistsContext)
	const [filter, setFilter] = useState<'owned' | 'shared'>('owned')
	const { user } = useContext(AppContext)

	useEffect(() => {
		const unsubscribe = getSetlists()
		return () => unsubscribe()
	}, [])

	const renderItem = ({ item }: { item: Setlist }) => {
		const { name, date, location } = item
		const month = dayjs(date).format('MMM')
		const day = dayjs(date).format('DD')
		const year = dayjs(date).format('YYYY')
		return (
			<Link
				href={{
					pathname: '/setlists/[id]',
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
							<Text>{location}</Text>
						</View>
					</View>
				</View>
			</Link>
		)
	}

	const listHeader = (
		<View style={styles.header}>
			<View style={{ flex: 1 }}>
				<Button onPress={() => setFilter('owned')} full ghost={filter === 'shared'} fontSize={16}>
					My setlists
				</Button>
			</View>
			<View style={{ flex: 1 }}>
				<Button onPress={() => setFilter('shared')} full ghost={filter === 'owned'} fontSize={16}>
					Shared With me
				</Button>
			</View>
		</View>
	)

	return (
		<View style={styles.container}>
			<FlatList
				contentContainerStyle={styles.list}
				ItemSeparatorComponent={() => <Divider full />}
				data={setlistsList.filter((setlist) => {
					const isOwned = setlist.owner === user.uid
					if (filter === 'owned') {
						return isOwned
					} else {
						return !isOwned
					}
				})}
				renderItem={renderItem}
				ListHeaderComponent={listHeader}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	header: {
		flexDirection: 'row',
		gap: 4,
		marginBottom: 8,
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
