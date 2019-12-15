
import {UserPanel} from "../components/user-panel.js"
import {UserAvatar} from "../components/user-avatar.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {PrivateVimeo} from "../components/private-vimeo.js"
import {AvatarDisplay} from "../components/avatar-display.js"
import {QuestionsForum} from "../components/questions-forum.js"

import {createUserModel} from "../models/user-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel} from "../models/paywall-model.js"
import {createQuestionsModel} from "../models/questions-model.js"

import {AuthComponent} from "../framework/mixin-auth.js"

import {AuthModel, AuthoritarianOptions} from "../interfaces.js"

export function prepareComponents({
	debug,

	tokenStorage,
	paywallGuardian,
	questionsBureau,
	profileMagistrate,
	privateVimeoGovernor,

	loginPopupRoutine,
	decodeAccessToken,
}: AuthoritarianOptions) {

	//
	// instance the models
	//

	const user = createUserModel({
		tokenStorage,
		decodeAccessToken,
		loginPopupRoutine,
	})

	const paywall = createPaywallModel({
		paywallGuardian,
	})

	const profile = createProfileModel({
		profileMagistrate
	})

	const questions = createQuestionsModel({questionsBureau})

	//
	// wire models to each other
	//

	// wire user to paywall
	paywall.wiring.loginWithAccessToken(user.wiring.loginWithAccessToken)
	user.subscribers.userLogin(paywall.wiring.receiveUserLogin)
	user.subscribers.userLogout(paywall.wiring.receiveUserLogout)
	user.subscribers.userError(paywall.wiring.receiveUserLogout)

	// wire user to profile
	user.subscribers.userLogin(profile.wiring.receiveUserLogin)
	user.subscribers.userError(profile.wiring.receiveUserLogout)
	user.subscribers.userLogout(profile.wiring.receiveUserLogout)
	user.subscribers.userLoading(profile.wiring.receiveUserLoading)

	// // on profile update, set avatar picture url
	// profile.reader.subscribe(state => {
	// 	if (!state.profile) return
	// 	const {picture} = profile.reader.state.profile.public
	// 	if (picture) avatar.wiring.setPictureUrl(picture)
	// })

	// // on paywall update, set avatar premium
	// paywall.reader.subscribe(state => {
	// 	const premium = state.mode === PaywallMode.Premium
	// 	avatar.wiring.setPremium(premium)
	// })

	// // on user logout or error, reset avatar
	// const resetAvatar = () => {
	// 	avatar.wiring.setPremium(false)
	// 	avatar.wiring.setPictureUrl(null)
	// }
	// user.subscribers.userError(resetAvatar)
	// user.subscribers.userLogout(resetAvatar)

	// update the questions model
	user.subscribers.userLogin(questions.wiring.receiveUserLogin)
	user.subscribers.userError(questions.wiring.receiveUserLogout)
	user.subscribers.userLogout(questions.wiring.receiveUserLogout)
	user.subscribers.userLoading(questions.wiring.receiveUserLogout)
	profile.reader.subscribe(state =>
		questions.wiring.updateProfile(state.profile))

	if (debug) {
		for (const [name, subscriber] of Object.entries(user.subscribers))
			subscriber(() => console.debug("event.user:", name))
		paywall.wiring.loginWithAccessToken(
			async() => console.debug("event.paywall:", "loginWithAccessToken")
		)
	}

	//
	// give back components and high level start function
	//

	return {
		components: {
			AvatarDisplay,
			PrivateVimeo: <typeof PrivateVimeo>class extends PrivateVimeo {
				static vimeoGovernor = privateVimeoGovernor
				static user = user
			},
			UserPanel: provideAuthModel(user, UserPanel),
			UserAvatar: provideAuthModel(profile, UserAvatar),
			ProfilePanel: provideAuthModel(profile, ProfilePanel),
			PaywallPanel: provideAuthModel(paywall, PaywallPanel),
			QuestionsForum: provideAuthModel(questions, QuestionsForum),
		},
		async start() {
			return user.wiring.start()
		}
	}
}

function provideAuthModel<
	C extends new(...args: any[]) => AuthComponent,
	M extends AuthModel = AuthModel
>(model: M, Constructor: C): C {

	return class extends Constructor {
		static model = model
	}
}
