
import {createPubSub} from "../toolbox/pub-sub.js"

export interface AvatarState {
	url: string
	premium: boolean
}

export function createAvatarModel() {
	const state: AvatarState = {
		url: "",
		premium: false,
	}

	const {publish, subscribe, unsubscribe} = createPubSub<() => void>()

	return {

		/** access state and subscribe to changes */
		stateAccess: {
			get state() {return Object.freeze({...state})},
			subscribe,
			unsubscribe,
		},

		/** alter state */
		writeAccess: {
			setAvatarUrl(url: string) {
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
