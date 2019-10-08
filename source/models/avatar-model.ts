
import {pubsub} from "../toolbox/pubsub.js"
import {makeReader} from "../toolbox/make-reader.js"
import {
	Reader,
	AvatarState,
	AvatarScribe,
	AvatarActions,
	AvatarListener,
} from "../system/interfaces.js"

export function createAvatarModel(): {
	reader: Reader<AvatarState, AvatarScribe>
	actions: AvatarActions
} {

	const state: AvatarState = {
		url: "",
		premium: false,
	}

	const {publish, subscribe, unsubscribe} = pubsub<AvatarListener>()

	return {
		reader: makeReader<AvatarState, AvatarScribe>({
			state,
			subscribe,
			unsubscribe,
		}),

		actions: {
			setPictureUrl(url: string) {
				state.url = url
				publish()
			},
			setPremium(premium: boolean) {
				state.premium = premium
				publish()
			},
		},
	}
}
