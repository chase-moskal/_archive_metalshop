
import {AuthPanelProps} from "../components/interfaces"
import {AuthPanelStore} from "../stores/auth-panel-store"

import {
	TokenApi,
	LoginApi,
	DecodeAccessToken
} from "../auth-machinery/interfaces"

/** Options to install the whole authoritarian client setup */
export interface InstallAuthoritarianClientOptions {
	element: Element
	authMachine: AuthMachine
}

/** Options to render the auth panel ui */
export interface RenderAuthPanelOptions extends AuthPanelProps {
	element: Element
}

/** Fundamental services for the auth machinery to operate */
export interface CreateAuthMachineOptions {
	tokenApi: TokenApi
	loginApi: LoginApi
	decodeAccessToken: DecodeAccessToken
}

export interface AuthMachine {
	panelStore: AuthPanelStore
	logout: () => Promise<void>
	passiveCheck: () => Promise<void>
	promptUserLogin: () => Promise<void>
}
