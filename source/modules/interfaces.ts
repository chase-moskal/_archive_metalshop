
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
	authServerUrl: string
}

export interface ApiCommunicatorOptions {
	authServerUrl: string
}

export interface AuthMachineOptions {
	authStore: AuthStore
	tokenStorage: TokenStorage
	apiCommunicator: ApiCommunicator
}

export interface InstallAuthPanelOptions {
	authServerUrl: string
	replaceElement: HTMLElement | Element
}
