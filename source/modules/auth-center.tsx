
import {h} from "preact"
import * as preact from "preact"

import {AuthMachine} from "source/stores/auth-machine"
// import {AuthControl} from "source/components/auth-control"

export function installAuthControl({
	google,
	authServerUrl,
	authControlElement,
	authStore = new AuthMachine()
}: {
	authStore?: AuthMachine
	authServerUrl: string
	authControlElement: Element
	google: {
		clientId: string
		scope: string
	}
}) {

	// initialize google auth
	gapi.auth2.init({

	})

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
