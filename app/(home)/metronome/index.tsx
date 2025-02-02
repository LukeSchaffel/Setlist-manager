import { StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

import { useMetronome } from '@/utils/metronome'
import { View, Text } from '@/components'

export default function MetronomeScreen() {
	const { bpm, isGreen, setBpm, isPlaying, setIsPlaying, totalBeats, currentBeat } = useMetronome()

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<View style={styles.lightContainer}>
					{Array.from({ length: totalBeats }, (_, index) => (
						<View
							key={index}
							style={[styles.light, isGreen && index + 1 === currentBeat ? styles.lightOn : styles.lightOff]}
						/>
					))}
				</View>
			</View>
			<View style={styles.bottom}>
				<View style={styles.bottomTop}>
					<View style={styles.controls}>
						<View style={styles.leftButtonContainer}>
							<Button mode="elevated" onPress={() => setBpm(bpm - 1)}>
								<AntDesign name="minus" size={24} color="black" />
							</Button>
						</View>
						<View style={styles.bpmContainer}>
							<TextInput
								mode="outlined"
								contentStyle={{ fontSize: 48 }}
								keyboardType="number-pad"
								value={bpm.toString()}
								onChangeText={(e) => {
									const value = parseInt(e, 10)
									if (isNaN(value) || !isFinite(value)) {
										setBpm(0)
									} else {
										setBpm(value)
									}
								}}
								returnKeyType="done"
							></TextInput>
						</View>
						<View style={styles.rightButtonContainer}>
							<Button mode="elevated" onPress={() => setBpm(bpm + 1)}>
								<AntDesign name="plus" size={24} color="black" />
							</Button>
						</View>
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
		gap: 16,
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
	},
	controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
	bottomBottom: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
	playButton: {
		width: 120,
		height: 80,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 0,
	},
	leftButtonContainer: {},
	bpmContainer: { flex: 1 / 2 },
	rightButtonContainer: {},
})
