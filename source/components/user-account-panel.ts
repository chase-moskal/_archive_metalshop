
import {LitElement, property, html, css} from "lit-element"

import {
	AccountPopupTopic,
	TokenStorageTopic,
	createAccountPopupCrosscallClient,
	createTokenStorageCrosscallClient
} from "authoritarian"

export class UserAccountPanel extends LitElement {
	@property({type: Object}) accountPopup: AccountPopupTopic = null
	@property({type: Object}) tokenStorage: TokenStorageTopic = null

	async prepare({url, hostOrigin}: {
		url: string
		hostOrigin: string
	}) {
		const [accountPopup, tokenStorage] = await Promise.all([
			createAccountPopupCrosscallClient({url, hostOrigin}),
			createTokenStorageCrosscallClient({url, hostOrigin})
		])
		this.accountPopup = accountPopup
		this.tokenStorage = tokenStorage
	}

	static get styles() {
		return css``
	}

	render() {
		return html``
	}
}
