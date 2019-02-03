
import {AuthPanelStore} from "../stores/auth-panel-store"

import {mocks} from "./mocks"
import {prepPassiveCheck} from "./prep-passive-check"
import {
	DecodeAccessToken
} from "./interfaces"
import { prepHandleAccessToken } from "./prep-handle-access-token";

function makeWiredPanelStore({
	decodeAccessToken = mocks.decodeAccessToken
}: {
	decodeAccessToken?: DecodeAccessToken
} = {}) {
	const panelStore = new AuthPanelStore()
	const handleAccessToken = prepHandleAccessToken({
		handleAccessData: data => panelStore.setAccessData(data),
		decodeAccessToken
	})
	return {panelStore, handleAccessToken}
}

describe("auth-machinery", () => {
	it("returning user recovers tokens and is logged in passively", async() => {
		const {panelStore, handleAccessToken} = makeWiredPanelStore()
		expect(panelStore.loggedIn).toBe(false)
		const passiveCheck = prepPassiveCheck({
			handleAccessToken,
			tokenApi: mocks.tokenApi
		})
		await passiveCheck()
		expect(panelStore.loggedIn).toBe(true)
	})
})
