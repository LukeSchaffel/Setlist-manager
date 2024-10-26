import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { ref, get, update } from 'firebase/database'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { Text, View, Button, Divider } from '@/components'
import { db } from '@/app/_layout'
import { Setlist, SetlistsContext, Song } from '../../_layout'
import Colors from '@/constants/Colors'

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
		const statusColor = { pending: 'orange', declined: 'red', accepted: 'green'  }[status as string]
		return (
			<View style={styles.listItem}>
				<View style={styles.listItemMain}>
					<View>
						<Text size={24} bold primary veryBold>
							{name}
						</Text>
					</View>
					<View>
						<Text size={16}>
							{email}
							<Text size={14}> - {role}</Text>
						</Text>
					</View>
				</View>
				<View>
					<Text lightColor={statusColor}>{status}</Text>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.page}>
			<FlatList
				renderItem={renderItem}
				data={selectedSetlist.shares}
				ItemSeparatorComponent={() => <Divider full />}
				contentContainerStyle={styles.list}
			/>
			<View style={styles.footer}>
				<Button.Primary onPress={openAddMemberModal}>Add members</Button.Primary>
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
