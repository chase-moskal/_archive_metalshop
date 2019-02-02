import { AuthPanelStore } from "./refactor/components/auth-panel";

/*

async function main() {

	const panelStore = new AuthPanelStore()

	const {passiveAuth, promptUserLogin, logout} = hocAuthTools({
		tokenApi,
		loginApi,
		verifyAndReadAccessToken,
		updateUserProfile: profile => panelStore.setUserProfile(profile),
	})

	renderAuthPanelUi({
		panelStore,
		handleUserLogin: () => promptUserLogin(),
		handleUserLogout: () => logout()
	})

	passiveAuth({})
}

*/
