import { User } from 'firebase/auth'
import { Avatar as RNPAvatar } from 'react-native-paper'

const Avatar = ({ user }: { user: User | null }) => {
	const { photoURL, displayName } = user ?? {}
	let textDisplay = 'NA'
	if (displayName) {
		textDisplay = displayName[0]
	}
	return (
		<>
			{photoURL ? (
				<RNPAvatar.Image
					size={128}
					source={{
						uri: photoURL,
					}}
				/>
			) : (
				<RNPAvatar.Text size={128} label={textDisplay} />
			)}
		</>
	)
}

export default Avatar
