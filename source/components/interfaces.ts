
import {AuthPanelStore} from "../stores/auth-panel-store"

export type HandleUserLogin = () => void
export type HandleUserLogout = () => void

export interface AuthPanelProps {
	panelStore: AuthPanelStore
	handleUserLogin: HandleUserLogin
	handleUserLogout: HandleUserLogout
}
