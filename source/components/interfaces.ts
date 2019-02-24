
import {AuthStore} from "../stores/auth-store"
import {AuthPanelStore} from "../stores/auth-panel-store"

export type HandleUserLogin = () => void
export type HandleUserLogout = () => void

export interface AuthPanelProps {
	panelStore: AuthPanelStore
	handleUserLogin: HandleUserLogin
	handleUserLogout: HandleUserLogout
}

export interface AuthSlateProps {
	authStore: AuthStore
	handleUserLogin: () => void
	handleUserLogout: () => void
}
