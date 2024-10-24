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

	const members: any = selectedSetlist?.sharedWith
		? Object.entries(selectedSetlist.sharedWith).map(([email, rest]) => ({ email, ...rest }))
		: []

	const renderItem = ({ item }: { item: any }) => {
		const { email, role, name } = item
		return (
			<View style={styles.listItem}>
				<View style={styles.listItemMain}>
					<View>
						<Text size={24} bold primary veryBold>
							{name} - {role}
						</Text>
					</View>
					<View>
						<Text size={16}>{email}</Text>
					</View>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.page}>
			<FlatList
				renderItem={renderItem}
				data={members}
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
