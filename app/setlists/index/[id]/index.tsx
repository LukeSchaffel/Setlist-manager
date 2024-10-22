import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { ref, get, update } from 'firebase/database'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { Text, View, Button, Divider } from '@/components'
import { db } from '@/app/_layout'
import { Setlist, SetlistsContext, Song } from '../_layout'
import Colors from '@/constants/Colors'

const DetailsPage = () => {
	const { id } = useLocalSearchParams()
	const { getSetlist, selectedSetlist } = useContext(SetlistsContext)

	const songs: Song[] = (
		selectedSetlist?.songs
			? Object.entries(selectedSetlist.songs).map(([key, song]: [key: Song['id'], song: Omit<Song, 'id'>]) => ({
					id: key,
					...song,
			  }))
			: []
	).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

	useEffect(() => {
		getSetlist(id as Setlist['id'])
	}, [id])

	if (!selectedSetlist) return <></>

	const openAddSongModal = () => {
		router.push(`/setlists/${id}/add-song`)
	}

	const moveSongUp = async (songId: Song['id']) => {
		if (!selectedSetlist || !selectedSetlist.songs) {
			return // Exit if selectedSetlist or songs are not defined
		}

		const song = selectedSetlist.songs[songId]

		if (!song || song.order <= 1) return // Do not move if already at the top

		const currentOrder = song.order

		// Find the entry of the song directly above the current song
		const upperSongIdEntry = Object.entries(selectedSetlist.songs).find(([_, s]) => {
			return s.order === currentOrder - 1 // Return true if the order matches
		})

		// Check if an upper song was found
		if (upperSongIdEntry) {
			const upperSongId = upperSongIdEntry[0] // Get the ID of the upper song

			// Prepare updates for the Firebase database
			const updates: any = {}
			updates[`/setlists/${id}/songs/${songId}/order`] = currentOrder - 1 // Move current song up
			updates[`/setlists/${id}/songs/${upperSongId}/order`] = currentOrder // Move upper song down

			await update(ref(db), updates) // Update the Firebase database
			await getSetlist(id as Setlist['id']) // Refresh the setlist after update
		}
	}

	const moveSongDown = async (songId: Song['id']) => {
		if (!selectedSetlist || !selectedSetlist.songs) {
			return // Exit if selectedSetlist or songs are not defined
		}

		const song = selectedSetlist.songs[songId]
		if (!song) return // Do not move if song does not exist

		const currentOrder = song.order

		// Find the entry of the song directly below the current song
		const lowerSongIdEntry = Object.entries(selectedSetlist.songs).find(([_, s]) => {
			return s.order === currentOrder + 1 // Return true if the order matches
		})

		// Check if a lower song was found
		if (lowerSongIdEntry) {
			const lowerSongId = lowerSongIdEntry[0] // Get the ID of the lower song

			// Prepare updates for the Firebase database
			const updates: any = {}
			updates[`/setlists/${id}/songs/${songId}/order`] = currentOrder + 1 // Move current song down
			updates[`/setlists/${id}/songs/${lowerSongId}/order`] = currentOrder // Move lower song up

			await update(ref(db), updates) // Update the Firebase database
			await getSetlist(id as Setlist['id']) // Refresh the setlist after update
		}
	}

	const renderItem = ({ item }: { item: Song }) => {
		const { artist, duration, order, title, id } = item
		return (
			<View style={styles.listItem}>
				<View>
					<Text size={24}>{order}</Text>
				</View>
				<View style={styles.listItemMain}>
					<View>
						<Text size={24} bold primary veryBold>
							{title}
						</Text>
					</View>
					<View>
						<Text size={16}>{artist}</Text>
					</View>
				</View>
				<View style={styles.listItemActions}>
					<Button onPress={() => moveSongUp(id)}>
						<FontAwesome5 name="arrow-up" size={24} color={Colors.light.primary} />
					</Button>
					<Button onPress={() => moveSongDown(id)}>
						<FontAwesome5 name="arrow-down" size={24} color={Colors.light.primary} />
					</Button>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.page}>
			<FlatList
				renderItem={renderItem}
				data={songs}
				ItemSeparatorComponent={() => <Divider full />}
				contentContainerStyle={styles.list}
			/>
			<View style={styles.footer}>
				<Button.Primary onPress={openAddSongModal}>Add songs</Button.Primary>
			</View>
		</View>
	)
}

export default DetailsPage

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
