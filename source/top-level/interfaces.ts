
import {AuthPanelProps} from "../components/interfaces"
import {AuthPanelStore} from "../stores/auth-panel-store"
import {AuthMachineryFundamentals} from "../auth-machinery/interfaces"

/** Options to install the whole authoritarian client setup */
export interface InstallAuthoritarianClientOptions extends AuthMachineryFundamentals {
	element: Element
	panelStore?: AuthPanelStore
}

/** Options to render the auth panel ui */
export interface RenderAuthPanelOptions extends AuthPanelProps {
	element: Element
}
