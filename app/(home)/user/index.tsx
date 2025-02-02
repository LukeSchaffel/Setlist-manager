import { useContext, useEffect, useState } from 'react'
import { db } from '@/app/_layout'
import { get, ref, query, orderByChild, equalTo, update } from 'firebase/database'
import { StyleSheet } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { List, useTheme, Button } from 'react-native-paper'
import Entypo from '@expo/vector-icons/Entypo'
import { Control, useForm } from 'react-hook-form'

import { FormInput } from '@/components'
import { AppContext } from '@/app/_layout'
import { Avatar, Text, View } from '@/components'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import dayjs from 'dayjs'
import Colors from '@/constants/Colors'
import { getAuth, updateProfile } from 'firebase/auth'

const Index = () => {
	const { user } = useContext(AppContext)
	const [shares, setShares] = useState<any[]>([])
	const { colors } = useTheme()
	const [edit, setEdit] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			displayName: '',
		},
	})

	const getShares = async () => {
		try {
			if (!user) return
			const sharesRef = ref(db, '/shares')
			const snapshot = await get(query(sharesRef, orderByChild('email'), equalTo(user.email)))

			const pendingShares = await Promise.all(
				Object.entries(snapshot.val() || {}).map(async ([key, shareData]: [key: string, shareData: any]) => {
					// Fetch the setlist data if `shareData.setlist` exists
					let setlistData = null
					if (shareData.setlist) {
						const setlistRef = ref(db, '/setlists/' + shareData.setlist)
						const setlistSnapshot = await get(setlistRef)
						setlistData = setlistSnapshot.val()
					}

					// Only return the share if its status is 'pending'
					if (shareData.status === 'pending') {
						return { id: key, ...shareData, setlistData }
					}
					return null
				})
			)

			// Filter out any null values (non-pending shares)
			setShares(pendingShares.filter((share) => share !== null))
		} catch (error) {
			console.log(error)
		}
	}

	const acceptInvite = async () => {
		try {
			if (!user) return
			const shareRef = ref(db, '/shares/' + share.id)
			const setlistRef = ref(db, '/setlists/' + share.setlist)
			const userSetlistRef = ref(db, '/users/' + user.uid + '/setlists/')

			// Await each update operation
			await update(shareRef, { status: 'accepted', name: user.displayName })
			await update(setlistRef, { updatedAt: Date.now() })
			await update(userSetlistRef, { [`${share.setlist}`]: true })
			await getShares()
		} catch (error) {
			console.log(error)
		}
	}

	const declineInvite = async () => {
		try {
			await update(ref(db, '/shares/' + share.id), { status: 'declined' })
			await update(ref(db, '/setlists/' + share.setlist), { updatedAt: Date.now() })
			await getShares()
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getShares()
	}, [])

	const share: any = shares[0]

	const shareUI = (
		<>
			{share && (
				<View style={styles.shareBox}>
					<Text bold size={24} centered>
						You have been invited to colaborate on: {share?.setlistData?.name}
					</Text>
					<View style={styles.details}>
						<View style={styles.iconRow}>
							<FontAwesome name="calendar" size={24} color={Colors.light.primary} />
							<Text size={24} style={{ verticalAlign: 'middle' }}>
								{share?.setlistData?.date
									? dayjs(share?.setlistData?.date || undefined).format('dddd, MMM D, YYYY')
									: 'No date'}
							</Text>
						</View>
						<View style={styles.iconRow}>
							<FontAwesome6 name="location-dot" size={24} color={Colors.light.primary} />
							<Text size={24} style={{ verticalAlign: 'middle' }}>
								{share?.setlistData?.location || 'No location'}
							</Text>
						</View>
					</View>
					<View style={styles.actionRow}>
						<View style={styles.buttonWrapper}>
							<Button onPress={() => acceptInvite()}>Accept</Button>
						</View>
						<View style={styles.buttonWrapper}>
							<Button onPress={() => declineInvite()}>Decline</Button>
						</View>
					</View>
				</View>
			)}
		</>
	)

	const submitProfile = async (values: any) => {
		try {
			const auth = getAuth()
			if (!auth.currentUser) return
			await updateProfile(auth.currentUser, {
				displayName: values.displayName,
				photoURL: 'https://example.com/jane-q-user/profile.jpg',
			})
			const updates: any = {}
			updates[`/users/${auth.currentUser.uid}/displayName`] = values.displayName
			updates[`/users/${auth.currentUser.uid}/photoURL`] = 'https://example.com/jane-q-user/profile.jpg'

			update(ref(db), updates)
		} catch (error) {
			console.log(error)
		}
	}

	const form = (
		<>
			<FormInput name="displayName" label="Name" control={control} />
			<Button onPress={handleSubmit(submitProfile)}>Update profile</Button>
			<Button onPress={() => setEdit(false)}>Cancel</Button>
		</>
	)

	return (
		<View style={styles.page}>
			<View style={styles.header}>
				<Avatar user={user} />
			</View>
			{!edit ? (
				<View style={styles.body}>
					<List.Item
						titleStyle={{ fontSize: 32, color: colors.secondary }}
						left={() => <AntDesign name="user" size={32} color={colors.secondary} />}
						title={user?.displayName || 'Name not provided'}
					/>
					<List.Item
						titleStyle={{ fontSize: 32, color: colors.secondary }}
						left={() => <Entypo name="email" size={32} color={colors.secondary} />}
						title={user?.email || 'Name not provided'}
					/>
					<Button onPress={() => setEdit(true)}>Edit profile</Button>
				</View>
			) : (
				form
			)}
			{shareUI}
		</View>
	)
}

export default Index

const styles = StyleSheet.create({
	page: {
		flex: 1,
		padding: 16,
		gap: 32,
	},
	header: {
		alignItems: 'center',
	},
	body: {
		flex: 1,
	},
	shareBox: {
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
