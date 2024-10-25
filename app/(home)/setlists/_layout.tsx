import { useState, createContext, useEffect, SetStateAction, Dispatch } from 'react'

import { Stack } from 'expo-router'
import { get, onValue, ref, Unsubscribe } from 'firebase/database'
import { auth, db } from '@/app/_layout'

export interface ISetlistsContext {
	selectedSetlist: Setlist | null
	setlistsList: Setlist[]
	setSelectedSetlist: Dispatch<SetStateAction<ISetlistsContext['selectedSetlist']>>
	setSetlistsList: Dispatch<SetStateAction<ISetlistsContext['setlistsList']>>
	getSetlists: () => any
	watchSetlist: (setlistId: Setlist['id']) => Unsubscribe
}
export const SetlistsContext = createContext<ISetlistsContext>({
	selectedSetlist: null,
	setlistsList: [],
	setSelectedSetlist: () => undefined,
	setSetlistsList: () => undefined,
	getSetlists: () => undefined,
	watchSetlist: (setlistId: Setlist['id']) => () => undefined,
})

//Types in frontend represent post-processed store data.

export interface Song {
	id: string
	title: string
	artist?: string
	order: number
	duration: number
}

export interface Setlist {
	id: string
	date?: string
	name?: string
	owner: string
	songs?: Song[]
	location?: string
	sharedWith?: Record<string, { role: string }>
}

const SetlistsLayout = () => {
	const [selectedSetlist, setSelectedSetlist] = useState<ISetlistsContext['selectedSetlist']>(null)
	const [setlistsList, setSetlistsList] = useState<ISetlistsContext['setlistsList']>([])

	const getSetlists = async () => {
		const userSetlistsRef = ref(db, '/users/' + auth.currentUser?.uid + '/setlists')
		const fetchSetlists = async (snapshot: any) => {
			if (snapshot.exists()) {
				const setlistIds = snapshot.val()
				const setlistPromises = Object.keys(setlistIds).map(async (setlistId) => {
					const setlistRef = ref(db, `setlists/${setlistId}`)
					const setlistSnapshot = await get(setlistRef)
					return { id: setlistId, ...setlistSnapshot.val() }
				})
				const setlists = await Promise.all(setlistPromises)
				setSetlistsList(setlists)
			} else {
				setSetlistsList([])
			}
		}
		const unsubscribe = onValue(userSetlistsRef, fetchSetlists)
		return unsubscribe
	}

	const watchSetlist = (setlistId: Setlist['id']) => {
		const setlistRef = ref(db, '/setlists/' + setlistId)
		const unsubscribe = onValue(setlistRef, async (snapshot) => {
			if (snapshot.exists()) {
				const setListVal = snapshot.val()
				const songIds = Object.keys(setListVal.songs || {})

				// Fetch each song's details based on its ID
				const songPromises = songIds.map(async (songId) => {
					const songRef = ref(db, '/songs/' + songId)
					const songSnapshot = await get(songRef)
					return songSnapshot.exists() ? { id: songId, ...songSnapshot.val() } : null
				})

				const songs = (await Promise.all(songPromises)).filter(Boolean) // Remove any nulls
				setSelectedSetlist({ id: setlistId, ...setListVal, songs })
			} else {
				setSelectedSetlist(null) // Handle case where the setlist doesn't exist
			}
		})

		return unsubscribe
	}

	return (
		<SetlistsContext.Provider
			value={{ selectedSetlist, setSelectedSetlist, setlistsList, setSetlistsList, getSetlists, watchSetlist }}
		>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false, title: 'My setlists ' }} />
				<Stack.Screen name="[id]/index" options={{ headerShown: true, title: '' }} />
				<Stack.Screen name="[id]/(songs)/song-list" options={{ title: 'Songs' }} />
				<Stack.Screen
					name="[id]/(songs)/add-song"
					options={{ presentation: 'modal', title: 'Add a song to this setlist' }}
				/>
			</Stack>
		</SetlistsContext.Provider>
	)
}

export default SetlistsLayout
