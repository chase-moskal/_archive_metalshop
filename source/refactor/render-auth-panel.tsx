
import {h} from "preact"
import * as preact from "preact"

import {AuthPanelProps} from "./components/interfaces"
import {AuthPanel} from "./components/auth-panel"

export function renderAuthPanel({
	element,
	panelStore,
	handleUserLogin,
	handleUserLogout
}: RenderAuthPanelOptions) {

	const tsx = (
		<AuthPanel {...{
			panelStore,
			handleUserLogin,
			handleUserLogout
		}}/>
	)

	preact.render(tsx, null, element)
}

export interface RenderAuthPanelOptions extends AuthPanelProps {
	element: Element
}
