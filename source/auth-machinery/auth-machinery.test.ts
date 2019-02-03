
import {prepAuthMachinery} from "./prep-auth-machinery"
import {AuthPanelStore} from "../stores/auth-panel-store"

import {mocks} from "./mocks"

function makeGoodAuthMachinery() {
	const panelStore = new AuthPanelStore()
	const auth = prepAuthMachinery({
		tokenApi: mocks.tokenApi.good,
		loginApi: mocks.loginApi.good,
		decodeAccessToken: mocks.decodeAccessToken.good,
		handleAccessData: data => panelStore.setAccessData(data)
	})
	return {auth, panelStore}
}

function makeBadAuthMachinery() {
	const panelStore = new AuthPanelStore()
	const auth = prepAuthMachinery({
		tokenApi: mocks.tokenApi.bad,
		loginApi: mocks.loginApi.bad,
		decodeAccessToken: mocks.decodeAccessToken.bad,
		handleAccessData: data => panelStore.setAccessData(data)
	})
	return {auth, panelStore}
}

describe("auth-machinery", () => {
	it("passive check can result in loggedIn", async() => {
		const {auth, panelStore} = makeGoodAuthMachinery()
		expect(panelStore.loggedIn).toBe(false)
		await auth.passiveCheck()
		expect(panelStore.loggedIn).toBe(true)
	})
})
