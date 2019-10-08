
import {pubsub} from "../toolbox/pubsub.js"
import {makeReader} from "../toolbox/make-reader.js"
import {
	Reader,
	AvatarState,
	AvatarSubscribe,
	AvatarActions,
	AvatarListener,
} from "../system/interfaces.js"

export function createAvatarModel(): {
	reader: Reader<AvatarState, AvatarSubscribe>
	actions: AvatarActions
} {

	const state: AvatarState = {
		url: "",
		premium: false,
	}

	const {publish, subscribe} = pubsub<AvatarListener>()

	return {
		reader: makeReader<AvatarState, AvatarSubscribe>({
			state,
			subscribe,
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
