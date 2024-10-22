import { Alert, StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ref, get, push, update } from 'firebase/database'
import { useForm, Controller } from 'react-hook-form'

import { Text, View, Input, Button } from '@/components'
import { db } from '@/app/_layout'

const SongList = ({}) => {
	const { id } = useLocalSearchParams()
	const [setList, setSetlist] = useState<any>({})

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

	const addSong = async (data: any) => {
		try {
			// Check if the setlist exists
			if (!setList) {
				Alert.alert('Setlist not found')
				return
			}

			// Get the reference to the setlist's songs node
			const songsRef = ref(db, `/setlists/${id}/songs`)

			// Add a new song entry
			const newSongRef = await push(songsRef) // Generate a new song ID
			const newSongId = newSongRef.key

			const newSongData = {
				title: data.title,
				artist: data.artist,
				duration: data.duration,
				order: Object.keys(setList.songs || {}).length + 1, // Optional: set order based on existing songs
			}

			// Create the update object for the new song
			const updates: any = {}
			updates[`/setlists/${id}/songs/${newSongId}`] = newSongData

			// Apply the updates
			await update(ref(db), updates)

			// Success message and reset form
			Alert.alert('Song added successfully')
			reset() // Reset form fields
      getSetlist()
		} catch (error) {
			Alert.alert('SOmething went wrong')
		}
	}

	return (
		<>
			<View style={styles.container}>
				<Text size={20} bold>
					Add songs
				</Text>
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
				<Button.Primary onPress={handleSubmit(addSong)}> Add song</Button.Primary>
				<Text>{JSON.stringify(setList.songs)}</Text>
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
		flex: 1,
		gap: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
})
