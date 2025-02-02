import { useContext } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Chip, Button } from 'react-native-paper'

import { View } from '@/components'
import { SetlistsContext } from '../../_layout'
import { List } from 'react-native-paper'

const SongListPage = () => {
	const { id } = useLocalSearchParams()
	const { selectedSetlist, setSelectedSetlist } = useContext(SetlistsContext)
	const navigation = useNavigation()

	if (!selectedSetlist) return <></>

	const openAddMemberModal = () => {
		router.push(`/setlists/${id}/add-member`)
	}

	const renderItem = ({ item }: { item: any }) => {
		const { email, role, name, status } = item
		const statusColor = { pending: 'orange', declined: 'red', accepted: 'green' }[status as string]
		return (
			<>
				<List.Item
					title={name}
					titleStyle={{ fontSize: 20 }}
					description={role}
					right={() => (
						<Chip mode="outlined" textStyle={{ color: statusColor }}>
							{status}
						</Chip>
					)}
				/>
			</>
		)
	}

	return (
		<View style={styles.page}>
			<FlatList renderItem={renderItem} data={selectedSetlist.shares} contentContainerStyle={styles.list} />
			<View style={styles.footer}>
				<Button mode="contained" onPress={openAddMemberModal}>
					Add members
				</Button>
			</View>
		</View>
	)
}

export default SongListPage

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	list: {
		padding: 16,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	listItemAvatar: {},
	listItemMain: {
		flexDirection: 'column',
		flex: 1,
	},
	listItemActions: {
		flexDirection: 'row',
		gap: 4,
	},
	footer: {
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
})
