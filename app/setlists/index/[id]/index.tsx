import { useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { ref, get, update } from 'firebase/database'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import { Text, View, Button, Divider } from '@/components'
import { db } from '@/app/_layout'

export interface Song {
	id: string
	title: string
	artist?: string
	order: number
	duration: number
}

const DetailsPage = () => {
	const { id } = useLocalSearchParams()
	const [setList, setSetlist] = useState<any>({})

	const songs: Song[] = (
		setList?.songs
			? Object.entries(setList.songs).map(([key, song]: [key: string, song: any]) => ({ id: key, ...song }))
			: []
	).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

	const getSetlist = async () => {
		const setlistRef = ref(db, '/setlists/' + id)
		const setlistSnapshot = await get(setlistRef)
		if (setlistSnapshot.exists()) {
			setSetlist(setlistSnapshot.val()) // Use .val() to extract the data
		} else {
			setSetlist(null) // Handle case where setlist does not exist
		}
	}

	useEffect(() => {
		getSetlist()
	}, [id])

	const openAddSongModal = () => {
		router.push(`/setlists/${id}/add-song`)
	}

	const moveSongUp = async (songId: string) => {
		const song = setList.songs[songId]
		if (!song || song.order <= 1) return // Do not move if already at the top

		const currentOrder = song.order
		const upperSongId = Object.keys(setList.songs).find((key) => setList.songs[key].order === currentOrder - 1)

		if (upperSongId) {
			// Update orders
			const updates: any = {}
			updates[`/setlists/${id}/songs/${songId}/order`] = currentOrder - 1 // Move current song up
			updates[`/setlists/${id}/songs/${upperSongId}/order`] = currentOrder // Move upper song down

			await update(ref(db), updates)
			await getSetlist()
		}
	}

	const moveSongDown = async (songId: string) => {
		const song = setList.songs[songId]
		if (!song) return // Do not move if song does not exist

		const currentOrder = song.order
		const lowerSongId = Object.keys(setList.songs).find((key) => setList.songs[key].order === currentOrder + 1)

		if (lowerSongId) {
			// Update orders
			const updates: any = {}
			updates[`/setlists/${id}/songs/${songId}/order`] = currentOrder + 1 // Move current song down
			updates[`/setlists/${id}/songs/${lowerSongId}/order`] = currentOrder // Move lower song up

			await update(ref(db), updates)
			await getSetlist()
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
						<Text size={24} bold>
							{title}
						</Text>
					</View>
					<View>
						<Text size={16}>{artist}</Text>
					</View>
				</View>
				<View style={styles.listItemActions}>
					<Button onPress={() => moveSongUp(id)}>Up</Button>
					<Button onPress={() => moveSongDown(id)}>Down</Button>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.page}>
			<FlatList renderItem={renderItem} data={songs} ItemSeparatorComponent={() => <Divider full />} />
			<Button.Primary onPress={openAddSongModal}>Add songs</Button.Primary>
		</View>
	)
}

export default DetailsPage

const styles = StyleSheet.create({
	page: {
		flex: 1,
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
})
