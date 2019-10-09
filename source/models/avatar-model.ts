
import {makeReader} from "../toolbox/make-reader.js"
import {
	Reader,
	AvatarState,
	AvatarActions,
} from "../system/interfaces.js"

export function createAvatarModel(): {
	reader: Reader<AvatarState>
	actions: AvatarActions
} {
	const state: AvatarState = {
		url: "",
		premium: false,
	}
	const reader = makeReader<AvatarState>(state)
	return {
		reader,
		actions: {
			setPictureUrl(url: string) {
				state.url = url
				reader.publishStateUpdate()
			},
			setPremium(premium: boolean) {
				state.premium = premium
				reader.publishStateUpdate()
			},
		}
	}
}
