import { StyleSheet, FlatList } from 'react-native'
import dayjs from 'dayjs'

import { auth, db } from '../../_layout'
import { Text, View, useThemeColor } from '@/components'
import { Divider } from '@/components'
import { useContext, useEffect, useState } from 'react'
import { get, onValue, ref } from 'firebase/database'
import { Link } from 'expo-router'
import { SetlistsContext } from './_layout'
import { Setlist } from './_layout'

export default function TabTwoScreen() {
	const primary = useThemeColor({}, 'primary')
	const { getSetlists, setlistsList } = useContext(SetlistsContext)

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

	return (
		<View style={styles.container}>
			<FlatList
				contentContainerStyle={styles.list}
				ItemSeparatorComponent={() => <Divider full />}
				data={setlistsList}
				renderItem={renderItem}
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
