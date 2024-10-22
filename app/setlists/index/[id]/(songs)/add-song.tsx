import { Alert, StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { ref, get, push, update } from 'firebase/database'
import { useForm, Controller } from 'react-hook-form'

import { Text, View, Input, Button } from '@/components'
import { db } from '@/app/_layout'
import { SetlistsContext } from '../../_layout'

const SongList = ({}) => {
	const { selectedSetlist, getSetlist } = useContext(SetlistsContext)
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			title: '',
			artist: '',
			duration: 0,
		},
	})

	const addSong = async (data: any) => {
		try {
			// Check if the setlist exists
			if (!selectedSetlist) {
				Alert.alert('Setlist not found')
				return
			}

			// Get the reference to the setlist's songs node
			const songsRef = ref(db, `/setlists/${selectedSetlist.id}/songs`)

			// Add a new song entry
			const newSongRef = await push(songsRef) // Generate a new song ID
			const newSongId = newSongRef.key

			const newSongData = {
				title: data.title,
				artist: data.artist,
				duration: data.duration,
				order: Object.keys(selectedSetlist.songs || {}).length + 1, // Optional: set order based on existing songs
			}

			// Create the update object for the new song
			const updates: any = {}
			updates[`/setlists/${selectedSetlist.id}/songs/${newSongId}`] = newSongData

			// Apply the updates
			await update(ref(db), updates)

			// Success message and reset form
			Alert.alert('Song added successfully')
			reset() // Reset form fields
			getSetlist(selectedSetlist.id)
		} catch (error) {
			Alert.alert('SOmething went wrong')
		}
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.form}>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input label="Title" value={value} onChangeText={onChange} onBlur={onBlur} />
						)}
						name="title"
						rules={{ required: 'This is required' }}
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input label="Title" value={value} onChangeText={onChange} onBlur={onBlur} />
						)}
						name="artist"
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label="Duration"
								value={value.toString()}
								onChangeText={(dur) => {
									const val = dur
									if (!isNaN(parseInt(dur))) {
										onChange(parseInt(dur))
									} else {
										onChange(0)
									}
								}}
								onBlur={onBlur}
							/>
						)}
						name="duration"
					/>
				</View>
				<View style={styles.buttons}>
					<Button.Primary onPress={handleSubmit(addSong)}>Add song</Button.Primary>
				</View>
			</View>
		</>
	)
}

export default SongList
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	form: {
		gap: 16,
		paddingTop: 16,
	},
	info: {
		flex: 1,
		paddingVertical: 16,
		gap: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	buttons: {
		gap: 16,
	},
})
