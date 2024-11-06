import { StyleSheet, ScrollView } from 'react-native'

import { Button } from 'react-native-paper'
import { View, Text, FormInput } from '@/components'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { onValue, ref, update } from 'firebase/database'
import { Control, useForm } from 'react-hook-form'
import { db } from '@/app/_layout'
import { Song } from '../../../_layout'

const SongDetailsPage = ({}) => {
	const { id: songId } = useLocalSearchParams()
	const [song, setSong] = useState<any>(null)
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm({
		defaultValues: {
			title: '',
			artist: '',
			duration: '',
			key: '',
			bpm: '',
			lyrics: '',
		},
	})

	const watchSong = () => {
		const songRef = ref(db, '/songs/' + songId)
		return onValue(songRef, async (snapshot) => {
			if (snapshot.exists()) {
				const songVal = snapshot.val()
				setValue('artist', songVal.artist || '')
				setValue('title', songVal.title || '')
				setValue('duration', songVal.duration || '')
				setValue('key', songVal.key || '')
				setValue('bpm', songVal.bpm || '')
				setValue('lyrics', songVal.lyrics || '')
				setSong(songVal)
			}
		})
	}

	useEffect(() => {
		const unsubscribe = watchSong()
		return () => unsubscribe()
	}, [songId])

	const updateSong = async (data: any) => {
		try {
			const updateSongData = {
				...song,
				title: data.title,
				artist: data.artist,
				duration: data.duration,
				key: data.key,
				bpm: data.bpm,
				lyrics: data.lyrics,
			}

			const updates: any = {}
			updates[`/songs/${songId}`] = updateSongData
			updates[`/setlists/${song.setlist}/updatedAt`] = Date.now()

			await update(ref(db), updates)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<ScrollView style={styles.page}>
			<View style={styles.form}>
				<FormInput name="title" control={control} label="Song title" rules={{ required: 'This is required' }} />
				<FormInput name="artist" label="Artist" control={control} />
				<FormInput.Number name="duration" label="Duration" control={control} />
				<FormInput name="key" label="Key" control={control} rules={{ maxLength: 15 }} maxLength={15} />
				<FormInput.Number name="bpm" label="BPM" control={control} rules={{ maxLength: 3 }} maxLength={3} />
				<FormInput.Field name="lyrics" label="Lyrics" control={control} />
			</View>
			<View>
				<Button mode="contained" onPress={handleSubmit(updateSong)}>
					Update song
				</Button>
			</View>
		</ScrollView>
	)
}

export default SongDetailsPage

const styles = StyleSheet.create({
	page: {
		flex: 1,
		gap: 16,
		padding: 16,
		backgroundColor: 'white',
	},
	form: {
		gap: 16,
		paddingTop: 16,
		marginBottom: 16,
	},
})
