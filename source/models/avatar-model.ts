
import {makeReader} from "../toolbox/make-reader.js"
import {
	Reader,
	AvatarState,
	AvatarWiring,
} from "../interfaces.js"

export function createAvatarModel(): {
	reader: Reader<AvatarState>
	wiring: AvatarWiring
} {
	const state: AvatarState = {
		url: "",
		premium: false,
	}
	const {reader, publishStateUpdate} = makeReader<AvatarState>(state)
	return {
		reader,
		wiring: {
			publishStateUpdate,
			setPictureUrl(url: string) {
				state.url = url
				publishStateUpdate()
			},
			setPremium(premium: boolean) {
				state.premium = premium
				publishStateUpdate()
			},
		}
	}
}
