
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
	replaceElement,
	authMachine = new AuthMachine({authServerUrl})
}: InstallAuthPanelOptions) {

	const authPanelElement = preact.render(
		<AuthPanel {...{authMachine}}/>,
		null,
		replaceElement
	)

	return {authMachine, authPanelElement}
}
