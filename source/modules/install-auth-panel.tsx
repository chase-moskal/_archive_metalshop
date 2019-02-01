
import {h} from "preact"
import * as preact from "preact"

import AuthMachine from "./auth-machine"
import TokenStorage from "./token-storage"
import ApiCommunicator from "./api-communicator"
import {InstallAuthPanelOptions} from "./interfaces"

import AuthStore from "../stores/auth-store"
import AuthPanel from "../components/auth-panel"

export default function installAuthPanel({
	authServerOrigin,
	replaceElement
}: InstallAuthPanelOptions) {

	const authStore = new AuthStore()
	const tokenStorage = new TokenStorage({authServerOrigin})
	const apiCommunicator = new ApiCommunicator({authServerOrigin})

	const authMachine = new AuthMachine({
		authStore,
		tokenStorage,
		apiCommunicator,
		authServerOrigin
	})

	const authPanelElement = preact.render(
		<AuthPanel {...{authMachine}}/>,
		null,
		replaceElement
	)

	return {authMachine, authPanelElement}
}
