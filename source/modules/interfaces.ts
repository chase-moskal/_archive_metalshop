
import ApiCommunicator from "./api-communicator"
import TokenStorage from "./token-storage"

import AuthStore from "../stores/auth-store"

/** Authentication token (refresh token) */
export type NToken = string

/** Authorization token (access token) */
export type ZToken = string

export interface AuthTokens {
	nToken: NToken
	zToken: ZToken
}

export interface TokenStorageOptions {
	authServerOrigin: string
}

export interface ApiCommunicatorOptions {
	authServerOrigin: string
}

export interface AuthMachineOptions {
	authStore: AuthStore
	authServerOrigin: string
	tokenStorage: TokenStorage
	apiCommunicator: ApiCommunicator
}

export interface InstallAuthPanelOptions {
	authServerOrigin: string
	replaceElement: HTMLElement | Element
}
