import { Audio } from 'expo-av'
import { useState, useEffect, useRef } from 'react'

export const useMetronome = () => {
	const [bpm, setBpm] = useState(120)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isGreen, setIsGreen] = useState(false)
	const [highSound, setHighSound] = useState<Audio.Sound>()
	const [lowSound, setLowSound] = useState<Audio.Sound>()
	const [ts, setTs] = useState<'4/4' | '3/4' | '1/4'>('4/4')
	const currentBeatRef = useRef(1)

	const loadSOunds = async () => {
		const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/high-click.m4a'))
		setHighSound(sound)

		const { sound: lowSound } = await Audio.Sound.createAsync(require('../assets/sounds/low-click.m4a'))
		setLowSound(lowSound)
	}
	useEffect(() => {
		loadSOunds()
		return highSound || lowSound
			? () => {
					highSound?.unloadAsync()
					lowSound?.unloadAsync()
			  }
			: undefined
	}, [])

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined = undefined
		if (!isPlaying) {
			clearTimeout(timer)
			currentBeatRef.current = 1
			return
		}

		const interval = 60000 / bpm

		const playBeat = async () => {
			setIsGreen(true)
			const currentBeat = currentBeatRef.current

			if (highSound && lowSound) {
				if (currentBeat === 1) {
					await highSound.replayAsync()
				} else {
					await lowSound.replayAsync()
				}
			}
			const numerator = parseInt(ts.split('/')[0])
			if (currentBeat === numerator) {
				currentBeatRef.current = 1
			} else {
				currentBeatRef.current = currentBeat + 1
			}

			setTimeout(() => setIsGreen(false), 100)

			timer = setTimeout(playBeat, interval)
		}

		timer = setTimeout(playBeat, interval)

		return () => clearTimeout(timer)
	}, [isPlaying, bpm, highSound, lowSound, ts])

	return {
		isPlaying,
		setIsPlaying,
		bpm,
		setBpm,
		isGreen,
		setIsGreen,
		totalBeats: parseInt(ts.split('/')[0]),
		currentBeat: currentBeatRef.current,
	}
}
