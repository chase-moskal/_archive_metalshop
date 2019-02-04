
import {TokenApi, LoginApi} from "authoritarian"

import {AuthPanelProps} from "../components/interfaces"
import {AuthPanelStore} from "../stores/auth-panel-store"
import {DecodeAccessToken} from "../auth-machinery/interfaces"

/** Options to install the whole authoritarian client setup */
export interface InstallAuthoritarianClientOptions extends AuthMachineFundamentals {
	element: Element
}

/** Options to render the auth panel ui */
export interface RenderAuthPanelOptions extends AuthPanelProps {
	element: Element
}

/** Extra pizzaz the create function needs to wire in the ui panel store */
export interface CreateAuthMachineOptions extends AuthMachineFundamentals {
	panelStore: AuthPanelStore
}

/** Fundamental services for the auth machinery to operate */
export interface AuthMachineFundamentals {
	tokenApi: TokenApi
	loginApi: LoginApi
	decodeAccessToken: DecodeAccessToken
}

/** Major auth functionality */
export interface AuthMachine {
	panelStore: AuthPanelStore
	logout: () => Promise<void>
	passiveCheck: () => Promise<void>
	promptUserLogin: () => Promise<void>
}
