
import * as crosscall from "crosscall"

import {AuthTokens} from "./interfaces"

import consoleCurry from "./console-curry"
const debug = consoleCurry({
	consoleFunction: console.debug,
	tag: "prompt-login-routine"
})

export default async function promptLoginRoutine({
	authServerOrigin
}: {
	authServerOrigin: string
}): Promise<AuthTokens> {

	debug("create popup")
	const {popup, postMessage} = crosscall.createPopup({
		url: `${authServerOrigin}/auth/login`,
		target: "_blank",
		features: "location=0,width=240,height=360",
		replace: true
	})
	popup.onclose = () => debug("popup CLOSED")

	debug("initialize crosscall client")
	const client = new crosscall.Client({
		hostOrigin: authServerOrigin,
		postMessage
	})
	const {topics, events} = await client.callable

	const tokens = {nToken: "n123", zToken: "z123"}
	debug("connected, returning tokens", tokens)
	return tokens
}
