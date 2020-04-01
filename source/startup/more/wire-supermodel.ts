
import {autorun} from "mobx"

import {AuthModel} from "../../supermodels/auth-model.js"
import {MetalOptions, Supermodel} from "../../interfaces.js"
import {ProfileModel} from "../../supermodels/profile-model.js"

export function wireSupermodel({
	tokenStorage,
	scheduleSentry,
	paywallGuardian,
	questionsBureau,
	liveshowGovernor,
	profileMagistrate,
	//—
	loginPopupRoutine,
	decodeAccessToken,
}: MetalOptions): Supermodel {

	const supermodel = {
		auth: new AuthModel({
			tokenStorage,
			loginPopupRoutine,
			decodeAccessToken,
			expiryGraceSeconds: 60
		}),
		profile: new ProfileModel({profileMagistrate})
	}

	// auth updates
	autorun(() => {
		const {mode, getAuthContext} = supermodel.auth
		supermodel.profile.handleAuthUpdate({mode, getAuthContext})
	})

	// // TODO more updates
	// user.reader.subscribe(paywall.receiveUserUpdate)
	// user.reader.subscribe(questions.receiveUserUpdate)
	// profile.reader.subscribe(state => questions.updateProfile(state.profile))
	// paywall.subscribeLoginWithAccessToken(user.receiveLoginWithAccessToken)

	return supermodel
}
