
import {mocks} from "../mocks"
// import {AuthPanelStore} from "../stores/auth-panel-store"

// import {CreateAuthMachineOptions} from "../interfaces"
// import {createAuthMachine} from "./create-auth-machine"

// const goodMocks: CreateAuthMachineOptions = {
// 	panelStore: new AuthPanelStore(),
// 	loginApi: mocks.loginApi,
// 	tokenApi: mocks.tokenApi,
// 	decodeAccessToken: mocks.decodeAccessToken
// }

// const mockMakers = {
// 	noAccessToken: () => ({
// 		...goodMocks,
// 		tokenApi: {
// 			...goodMocks.tokenApi,
// 			async obtainAccessToken() {
// 				return undefined
// 			}
// 		}
// 	})
// }

xdescribe("auth-machine - user flows", () => {
	xdescribe("first-time user", () => {
		it("starts logged out, and decides to login, and logout", async() => {
			// const auth = createAuthMachine(mockMakers.noAccessToken())
			// expect(auth.panelStore.loggedIn).toBe(false)
			// await auth.passiveCheck()
			// expect(auth.panelStore.loggedIn).toBe(false)
			// await auth.promptUserLogin()
			// expect(auth.panelStore.accessData).toBeTruthy()
			// expect(auth.panelStore.loggedIn).toBe(true)
			// await auth.logout()
			// expect(auth.panelStore.loggedIn).toBe(false)
			// expect(auth.panelStore.accessData).toBeFalsy()
		})
	})

	xdescribe("user with valid tokens", () => {
		it("is logged in by the passive check", async() => {
			// const auth = createAuthMachine(goodMocks)
			// expect(auth.panelStore.loggedIn).toBe(false)
			// await auth.passiveCheck()
			// expect(auth.panelStore.loggedIn).toBe(true)
		})
	})

	xdescribe("user with invalid access token", () => {
		it("uses refresh token to obtain a fresh access token", async() => {
			// const auth = createAuthMachine(mockMakers.noAccessToken())
			// expect(auth.panelStore.loggedIn).toBe(false)
			// await auth.passiveCheck()
			// expect(auth.panelStore.loggedIn).toBe(true)
		})
	})

	xdescribe("user with all-invalid tokens", () => {
		it("user is logged out", async() => {
			// expect(true).toBe(false)
		})
	})
})
