import { Alert, StyleSheet } from 'react-native'
import { useContext, useState } from 'react'
import { ref, push, update } from 'firebase/database'
import { useForm, Controller } from 'react-hook-form'
import { Button } from 'react-native-paper'
import { Snackbar } from 'react-native-paper'

import { View, Input, FormInput } from '@/components'
import { db } from '@/app/_layout'
import { SetlistsContext } from '../../_layout'
import { router } from 'expo-router'

const SongList = ({}) => {
	const { selectedSetlist } = useContext(SetlistsContext)
	const [snackBar, setSnackBar] = useState<{ visible: boolean; actionId: null | string }>({
		visible: false,
		actionId: null,
	})
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			title: '',
			artist: '',
			duration: '',
		},
	})

	const addSong = async (data: any) => {
		try {
			// Check if the setlist exists
			if (!selectedSetlist) {
				Alert.alert('Setlist not found')
				return
			}

			const { id: setlistId } = selectedSetlist

			// Add a new song entry
			const newSong = await push(ref(db, `/songs`)) // Generate a new song ID
			const newSongId = newSong.key

			if (!newSongId) {
				return
			}

			const newSongData = {
				title: data.title,
				artist: data.artist,
				duration: data.duration,
				order: Object.keys(selectedSetlist.songs || {}).length + 1,
				setlist: setlistId,
			}

			// Create the update object for the new song
			const updates: any = {}
			updates[`/setlists/${setlistId}/songs/${newSongId}`] = true
			updates[`/songs/${newSongId}`] = newSongData

			// Apply the updates
			await update(ref(db), updates)

			// Success message and reset form
			// Alert.alert('Song added successfully')
			setSnackBar({ visible: true, actionId: newSongId })
			reset() // Reset form fields
		} catch (error) {
			Alert.alert('SOmething went wrong')
		}
	}

	const hideSnackBark = () => {
		setSnackBar({ visible: false, actionId: null })
	}

	const goToSongDetails = () => {
		if (!selectedSetlist?.id) {
			return
		}
		router.push(`/setlists/${selectedSetlist.id}/songs/${snackBar.actionId}`)
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.form}>
					<FormInput name="title" control={control} label="Song title" rules={{ required: 'This is required' }} />
					<FormInput name="artist" label="Artist" control={control} />
					<FormInput.Number name="duration" label="Duration" control={control} />
				</View>
				<View style={styles.buttons}>
					<Button mode="contained" onPress={handleSubmit(addSong)}>
						Add song
					</Button>
				</View>
				<Snackbar
					visible={snackBar.visible}
					onDismiss={hideSnackBark}
					duration={1000}
					action={{ label: 'Add song details', onPress: goToSongDetails }}
				>
					Song added!
				</Snackbar>
			</View>
		</>
	)
}

export default SongList
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'space-between',
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
