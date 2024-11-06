import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import { SegmentedButtons, List, FAB } from 'react-native-paper'

import { AppContext } from '../../_layout'
import { Text, View, useThemeColor, Divider } from '@/components'
import { SetlistsContext } from './_layout'
import { Setlist } from './_layout'

export default function TabTwoScreen() {
	const primary = useThemeColor({}, 'primary')
	const { getSetlists, setlistsList } = useContext(SetlistsContext)
	const [filter, setFilter] = useState<'owned' | 'shared'>('owned')
	const { user } = useContext(AppContext)

	useEffect(() => {
		const unsubscribe = getSetlists()
	}, [])

	const renderItem = ({ item }: { item: Setlist }) => {
		const { name, date, location } = item
		const month = dayjs(date).format('MMM')
		const day = dayjs(date).format('DD')
		const year = dayjs(date).format('YYYY')
		return (
			<List.Item
				title={name}
				titleStyle={{ fontSize: 20 }}
				left={() => (
					<View style={[styles.dateBox, { borderColor: primary }]}>
						<Text style={styles.month}>{month}</Text>
						<Text style={styles.day}>{day}</Text>
						<Text style={styles.year}> {year}</Text>
					</View>
				)}
				description={location}
				onPress={() => router.push(`/setlists/${item.id}`)}
			/>
		)
	}

	const listHeader = (
		<SegmentedButtons
			value={filter}
			buttons={[
				{
					label: 'My setlists',
					value: 'owned',
				},
				{
					label: 'Shared with me',
					value: 'shared',
				},
			]}
			onValueChange={(val: any) => setFilter(val)}
			style={{ marginBottom: 4 }}
		/>
	)

	return (
		<View style={styles.container}>
			<FlatList
				contentContainerStyle={styles.list}
				ItemSeparatorComponent={() => <Divider full style={{ margin: 1 }} />}
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
			<FAB icon="plus" style={styles.fab} onPress={() => router.push('/setlists/create')} />
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
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
})
