import { Audio } from 'expo-av'
import { useState, useEffect } from 'react'

export const useMetronome = () => {
	const [bpm, setBpm] = useState(120)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isGreen, setIsGreen] = useState(false)
	const [sound, setSound] = useState<Audio.Sound>()

	const loadSound = async () => {
		const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/met-up.wav'))
		setSound(sound)
	}

	useEffect(() => {
		loadSound()
		return sound
			? () => {
					sound.unloadAsync()
			  }
			: undefined
	}, [])

	useEffect(() => {
		if (!isPlaying) return

		const interval = 60000 / bpm

		const timer = setInterval(async () => {
			setIsGreen(true)
			if (sound) {
				await sound.replayAsync()
			}
			setTimeout(() => setIsGreen(false), 100)
		}, interval)

		return () => clearInterval(timer)
	}, [isPlaying, bpm, sound])

	return { isPlaying, setIsPlaying, setSound, bpm, setBpm, isGreen, setIsGreen }
}
