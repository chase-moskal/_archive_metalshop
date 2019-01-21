
import {h} from "preact"
import * as preact from "preact"

import {AuthMachine} from "../stores/auth-machine"
import {AuthPanel} from "../components/auth-panel"

export interface InstallAuthPanelOptions {
	authServerUrl: string
	authMachine?: AuthMachine
	replaceElement: HTMLElement | Element
}

export function installAuthPanel({
	authServerUrl,
	authMachine,
	replaceElement
}: InstallAuthPanelOptions) {

	authMachine = authMachine || new AuthMachine({authServerUrl})

	const authPanelElement = preact.render(
		<AuthPanel authMachine={authMachine}/>,
		null,
		replaceElement
	)

	return {authMachine, authPanelElement}
}
