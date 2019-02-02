
import {DecodeAccessToken} from "../interfaces"
import {AuthPanelProps} from "../components/interfaces"
import {AuthPanelStore} from "../stores/auth-panel-store"
import {TokenApi, LoginApi} from "../auth-machinery/interfaces"

export interface InstallAuthMachineryOptions {
	tokenApi: TokenApi
	loginApi: LoginApi
	decodeAccessToken: DecodeAccessToken
	panelStore?: AuthPanelStore
}

export interface RenderAuthPanelOptions extends AuthPanelProps {
	element: Element
}
