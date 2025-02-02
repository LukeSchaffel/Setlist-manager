import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { View, Text } from '@/components'

export default function MetronomeScreen() {
	const [bpm, setBpm] = useState(60)
	const [isPlaying, setIsPlaying] = useState(true)
	const [isGreen, setIsGreen] = useState(false)

	useEffect(() => {
		if (!isPlaying) return

		const interval = 60000 / bpm

		const timer = setInterval(() => {
			setIsGreen(true)

			setTimeout(() => setIsGreen(false), 100)
		}, interval)

		return () => clearInterval(timer)
	}, [isPlaying, bpm])

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.lightContainer}>
					<View style={[styles.light, isGreen ? styles.lightOn : styles.lightOff]} />
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomTop}>
					<View style={styles.leftButtonContainer}>
						<Button mode="elevated" onPress={() => setBpm(bpm - 1)}>
							<AntDesign name="minus" size={24} color="black" />
						</Button>
					</View>
					<View style={styles.bpmContainer}>
						<Text size={48}>{bpm}</Text>
					</View>
					<View style={styles.rightButtonContainer}>
						<Button mode="elevated" onPress={() => setBpm(bpm + 1)}>
							<AntDesign name="plus" size={24} color="black" />
						</Button>
					</View>
				</View>
				<View style={styles.bottomBottom}>
					<Button mode="elevated" onPress={() => setIsPlaying(!isPlaying)} contentStyle={styles.playButton}>
						<View />
						{isPlaying ? (
							<Feather name="pause" size={32} color="black" />
						) : (
							<Feather name="play" size={32} color="black" />
						)}
					</Button>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	top: {
		flex: 1,
	},
	lightContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	light: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	lightOff: {
		backgroundColor: 'red',
	},
	lightOn: {
		backgroundColor: 'green',
		transform: [{ scale: 1.1 }],
		shadowColor: 'green',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 5,
	},
	bottom: { flex: 1 },
	bottomTop: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	bottomBottom: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
	playButton: {
		width: 120,
		height: 80,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 0,
	},
	leftButtonContainer: {},
	bpmContainer: {},
	rightButtonContainer: {},
})
