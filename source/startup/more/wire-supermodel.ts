
import {autorun} from "mobx"

import {AuthModel} from "../../models/auth-model.js"
import {ProfileModel} from "../../models/profile-model.js"
import {PaywallModel} from "../../models/paywall-model.js"
import {MetalOptions, Supermodel, AuthUpdate} from "../../interfaces.js"

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
		profile: new ProfileModel({profileMagistrate}),
		paywall: new PaywallModel({paywallGuardian}),
	}

	// auth updates
	autorun(() => {
		const {user, mode, getAuthContext} = supermodel.auth
		const update: AuthUpdate = {user, mode, getAuthContext}
		supermodel.profile.handleAuthUpdate(update)
		supermodel.paywall.handleAuthUpdate(update)
	})

	// paywall updates
	autorun(() => {
		const {newAccessToken} = supermodel.paywall
		supermodel.auth.loginWithAccessToken(newAccessToken)
	})

	// // TODO more updates
	// user.reader.subscribe(paywall.receiveUserUpdate)
	// user.reader.subscribe(questions.receiveUserUpdate)
	// profile.reader.subscribe(state => questions.updateProfile(state.profile))
	// paywall.subscribeLoginWithAccessToken(user.receiveLoginWithAccessToken)

	return supermodel
}
