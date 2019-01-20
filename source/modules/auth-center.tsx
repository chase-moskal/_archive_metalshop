
import {h} from "preact"
import * as preact from "preact"

import {AuthStore} from "source/stores/auth-store"
import {AuthControl} from "source/components/auth-control"

export function installAuthControl({
	authServerUrl,
	authControlElement,
	authStore = new AuthStore()
}: {
	authStore?: AuthStore
	authServerUrl: string
	authControlElement: Element
}) {

	const newAuthControlElement = preact.render(
		<AuthControl store={authStore}/>,
		null,
		authControlElement
	)

	return {
		authStore,
		newAuthControlElement
	}
}
