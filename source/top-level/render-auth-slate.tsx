
import {h} from "preact"
import * as preact from "preact"

import {AuthSlate} from "../components/auth-slate"
import {RenderAuthSlateOptions} from "./interfaces"

export function renderAuthSlate({
	element,
	authStore,
	handleUserLogin,
	handleUserLogout
}: RenderAuthSlateOptions) {

	const tsx = (
		<AuthSlate {...{
			authStore,
			handleUserLogin,
			handleUserLogout
		}}/>
	)

	preact.render(tsx, null, element)
}
