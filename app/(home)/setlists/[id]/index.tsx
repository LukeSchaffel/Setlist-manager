import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { ref, get, update } from 'firebase/database'
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import dayjs from 'dayjs'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

import { formatDuration } from '@/utils'
import { Text, View, Button, Divider } from '@/components'
import { db } from '@/app/_layout'
import { SetlistsContext, Setlist, Song } from '../_layout'
import Colors from '@/constants/Colors'

const DetailsPage = () => {
	const { id } = useLocalSearchParams()
	const { getSetlist, selectedSetlist, setSelectedSetlist } = useContext(SetlistsContext)

	const navigation = useNavigation()

	useEffect(() => {
		getSetlist(id as Setlist['id'])
	}, [id])

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			// Call your function here when leaving the screen
			setSelectedSetlist(null)
		})

		return unsubscribe // Clean up the listener when the component unmounts
	}, [navigation])

	return (
		<View style={styles.page}>
			{/* header */}
			<View>
				<Text size={48} primary bold>
					{selectedSetlist?.name}
				</Text>
				<Divider full />
			</View>

			{/* details */}
			<View style={styles.details}>
				<View style={styles.iconRow}>
					<FontAwesome name="calendar" size={24} color={Colors.light.primary} />
					<Text size={24} style={{ verticalAlign: 'middle' }}>
						{selectedSetlist?.date ? dayjs(selectedSetlist?.date || undefined).format('dddd, MMM D, YYYY') : 'No date'}
					</Text>
				</View>
				<View style={styles.iconRow}>
					<FontAwesome6 name="location-dot" size={24} color={Colors.light.primary} />
					<Text size={24} style={{ verticalAlign: 'middle' }}>
						{selectedSetlist?.location || 'No location'}
					</Text>
				</View>
				<View style={styles.iconRow}>
					<FontAwesome name="music" size={24} color={Colors.light.primary} />
					<Text size={24} style={{ verticalAlign: 'middle' }}>
						{selectedSetlist?.songs ? Object.keys(selectedSetlist.songs).length : 0} songs
					</Text>
				</View>
				<View style={styles.iconRow}>
					<FontAwesome6 name="clock-four" size={24} color={Colors.light.primary} />
					<Text size={24} style={{ verticalAlign: 'middle' }}>
						Total duration:{' '}
						{selectedSetlist?.songs
							? formatDuration(Object.values(selectedSetlist.songs).reduce((a, b) => a + b.duration, 0))
							: 0}
					</Text>
				</View>
				<View style={styles.iconRow}>
					<FontAwesome6 name="people-group" size={24} color={Colors.light.primary} />
					<Text size={24} style={{ verticalAlign: 'middle' }}>
						Shared with {0} people
					</Text>
				</View>
			</View>

			{/* Buttons container */}
			<View style={styles.actions}>
				<View style={styles.actionRow}>
					<View style={styles.buttonWrapper}>
						<Button fontSize={20} full onPress={() => router.push(`/setlists/${selectedSetlist?.id}/song-list`)}>
							View songs
						</Button>
					</View>
					<View style={styles.buttonWrapper}>
						<Button fontSize={20} full onPress={() => undefined}>
							View members
						</Button>
					</View>
				</View>
				<View style={styles.actionRow}>
					<View style={styles.buttonWrapper}>
						<Button fontSize={20} full onPress={() => undefined}>
							Get directions
						</Button>
					</View>
					<View style={styles.buttonWrapper}>
						<Button fontSize={20} full onPress={() => undefined}>
							Start gig
						</Button>
					</View>
				</View>
			</View>
		</View>
	)
}

export default DetailsPage

const styles = StyleSheet.create({
	page: {
		flex: 1,
		padding: 16,
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 16,
	},
	details: {
		gap: 8,
	},
	iconRow: {
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actions: {
		width: '100%',
		gap: 4,
	},
	actionRow: { flexDirection: 'row', flexWrap: 'nowrap', gap: 4 },
	buttonWrapper: {
		flex: 1,
	},
})
