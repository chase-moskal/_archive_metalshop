
import {h} from "preact"
import * as preact from "preact"

import {AuthPanel} from "../components/auth-panel"
import {RenderAuthPanelOptions} from "./interfaces"

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
