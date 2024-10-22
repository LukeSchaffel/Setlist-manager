import { useState, createContext, useEffect, SetStateAction, Dispatch } from 'react'

import { Stack } from 'expo-router'
import { get, onValue, ref } from 'firebase/database'
import { auth, db } from '@/app/_layout'

export interface ISetlistsContext {
	selectedSetlist: Setlist | null
	setlistsList: Setlist[]
	setSelectedSetlist: Dispatch<SetStateAction<ISetlistsContext['selectedSetlist']>>
	setSetlistsList: Dispatch<SetStateAction<ISetlistsContext['setlistsList']>>
	getSetlists: () => any
	getSetlist: (id: Setlist['id']) => any
}
export const SetlistsContext = createContext<ISetlistsContext>({
	selectedSetlist: null,
	setlistsList: [],
	setSelectedSetlist: () => undefined,
	setSetlistsList: () => undefined,
	getSetlists: () => undefined,
	getSetlist: () => undefined,
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
	songs?: Record<string, Song>
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

	const getSetlist = async (setlistId: Setlist['id']) => {
		const setlistRef = ref(db, '/setlists/' + setlistId)
		const setlistSnapshot = await get(setlistRef)
		if (setlistSnapshot.exists()) {
			const setListVal = setlistSnapshot.val()
			setSelectedSetlist({ id: setlistId, ...setListVal })
		} else {
			setSelectedSetlist(null)
		}
	}

	return (
		<SetlistsContext.Provider
			value={{ selectedSetlist, setSelectedSetlist, setlistsList, setSetlistsList, getSetlists, getSetlist }}
		>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false, title: 'My setlists ' }} />
				<Stack.Screen name="[id]/index" options={{ title: '' }} />
				<Stack.Screen
					name="[id]/(songs)/add-song"
					options={{ presentation: 'modal', title: 'Add a song to this setlist' }}
				/>
			</Stack>
		</SetlistsContext.Provider>
	)
}

export default SetlistsLayout
