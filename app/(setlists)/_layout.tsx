import React, { useContext, useEffect } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Redirect, router, Tabs } from 'expo-router'
import { Button, Pressable } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { signOut, getAuth } from 'firebase/auth'
import { AppContext } from '../_layout'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
	const colorScheme = useColorScheme()
	const auth = getAuth()
	const { user } = useContext(AppContext)

	if (!user) {
		return <Redirect href="/auth" />
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				headerShown: useClientOnlyValue(false, true),
			}}
		>
			<Tabs.Screen
				name="view"
				options={{
					title: 'My setlists',
					tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
					headerRight: () => (
						<Button title="Logout" onPress={() => signOut(auth).then(() => router.replace('/auth'))} />
					),
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					title: 'Create a setlist',
					tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
				}}
			/>
		</Tabs>
	)
}
