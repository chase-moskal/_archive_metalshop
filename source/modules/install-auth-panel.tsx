
import {h} from "preact"
import * as preact from "preact"

import AuthMachine from "./auth-machine"
import ApiCommunicator from "./api-communicator"
import {InstallAuthPanelOptions} from "./interfaces"

import AuthStore from "../stores/auth-store"
import AuthPanel from "../components/auth-panel"
import TokenStorage from "./token-storage";

export default function installAuthPanel({
	authServerUrl,
	replaceElement
}: InstallAuthPanelOptions) {

	const authStore = new AuthStore()
	const tokenStorage = new TokenStorage({authServerUrl})
	const apiCommunicator = new ApiCommunicator({authServerUrl})

	const authMachine = new AuthMachine({
		authStore,
		tokenStorage,
		apiCommunicator
	})

	const authPanelElement = preact.render(
		<AuthPanel {...{authMachine}}/>,
		null,
		replaceElement
	)

	return {authMachine, authPanelElement}
}
