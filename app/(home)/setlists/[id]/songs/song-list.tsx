import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { ref, get, update } from 'firebase/database'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { List, Button } from 'react-native-paper'

import { Text, View, Divider } from '@/components'
import { db } from '@/app/_layout'
import { Setlist, SetlistsContext, Song } from '../../_layout'
import Colors from '@/constants/Colors'

const SongListPage = () => {
	const { id } = useLocalSearchParams()
	const { selectedSetlist, setSelectedSetlist } = useContext(SetlistsContext)
	const navigation = useNavigation()

	const songs: Song[] = (
		selectedSetlist?.songs
			? Object.entries(selectedSetlist.songs).map(([key, song]: [key: Song['id'], song: Omit<Song, 'id'>]) => ({
					id: key,
					...song,
			  }))
			: []
	).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

	if (!selectedSetlist) return <></>

	const openAddSongModal = () => {
		router.push(`/setlists/${id}/songs/add-song`)
	}

	const moveSongUp = async (songId: Song['id']) => {
		if (!selectedSetlist || !selectedSetlist.songs) {
			return // Exit if selectedSetlist or songs are not defined
		}

		const song = selectedSetlist.songs.find((song) => songId === song.id)

		if (!song || song.order <= 1) return // Do not move if already at the top

		const currentOrder = song.order

		// Find the entry of the song directly above the current song
		const upperSongIdEntry = selectedSetlist.songs.find((song) => {
			return song.order === currentOrder - 1 // Return true if the order matches
		})

		// Check if an upper song was found
		if (upperSongIdEntry) {
			const upperSongId = upperSongIdEntry.id // Get the ID of the upper song

			// Prepare updates for the Firebase database
			const updates: any = {}
			updates[`/songs/${songId}/order`] = currentOrder - 1 // Move current song up in songs node
			updates[`/songs/${upperSongId}/order`] = currentOrder // Move upper song down in songs node
			updates[`/setlists/${selectedSetlist.id}/updatedAt`] = Date.now() // Update the timestamp in the setlist

			await update(ref(db), updates) // Update the Firebase database
		}
	}

	const moveSongDown = async (songId: Song['id']) => {
		if (!selectedSetlist || !selectedSetlist.songs) {
			return // Exit if selectedSetlist or songs are not defined
		}

		const song = selectedSetlist.songs.find((song) => songId === song.id)
		if (!song) return // Do not move if song does not exist

		const currentOrder = song.order

		// Find the entry of the song directly below the current song
		const lowerSongIdEntry = selectedSetlist.songs.find((s) => {
			return s.order === currentOrder + 1 // Return true if the order matches
		})

		// Check if a lower song was found
		if (lowerSongIdEntry) {
			const lowerSongId = lowerSongIdEntry.id // Get the ID of the lower song

			// Prepare updates for the Firebase database
			const updates: any = {}
			updates[`/songs/${songId}/order`] = currentOrder + 1 // Move current song down
			updates[`/songs/${lowerSongId}/order`] = currentOrder // Move lower song up
			updates[`/setlists/${selectedSetlist.id}/updatedAt`] = Date.now() // Update the timestamp in the setlist

			await update(ref(db), updates) // Update the Firebase database
		}
	}

	const renderItem = ({ item }: { item: Song }) => {
		const { artist, duration, order, title, id } = item
		return (
			<List.Item
				onPress={() => router.push(`/setlists/${id}/songs/${id}`)}
				left={() => (
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Text bold size={20}>
							{order} .
						</Text>
					</View>
				)}
				title={title}
				titleStyle={{ fontSize: 20 }}
				description={artist + ' ' + ' - ' + duration}
				right={() => (
					<View style={styles.listItemActions}>
						<Button mode="text" onPress={() => moveSongUp(id)}>
							<FontAwesome5 name="arrow-up" size={24} color={Colors.light.primary} />
						</Button>
						<Button mode="text" onPress={() => moveSongDown(id)}>
							<FontAwesome5 name="arrow-down" size={24} color={Colors.light.primary} />
						</Button>
					</View>
				)}
				style={{ paddingRight: 0 }}
			/>
		)
	}

	return (
		<View style={styles.page}>
			<FlatList
				renderItem={renderItem}
				data={songs}
				// ItemSeparatorComponent={() => <Divider full />}
				contentContainerStyle={styles.list}
			/>
			<View style={styles.footer}>
				<Button mode="contained" onPress={openAddSongModal}>
					Add songs
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
	listItemActions: {
		flexDirection: 'row',
	},
	footer: {
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
})
