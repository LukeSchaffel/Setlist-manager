export const formatDuration = (seconds: number) => {
	if (!seconds) {
		return '00:00'
	}
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = seconds % 60

	const formattedHours = hours.toString().padStart(2, '0')
	const formattedMinutes = minutes.toString().padStart(2, '0')
	const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export const encodeEmail = (email: string) => {
	return email.replace(/@/g, '-at-').replace(/\./g, '-dot-')
}

export const decodeEmail = (encodedEmail: string) => {
	return encodedEmail.replace(/-at-/g, '@').replace(/-dot-/g, '.')
}
