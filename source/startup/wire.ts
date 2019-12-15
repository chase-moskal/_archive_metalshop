
// import {AuthoritarianStartupError} from "../system/errors.js"
import {
	Supermodel,
	AuthoritarianOptions,
} from "../interfaces.js"

import {createUserModel} from "../models/user-model.js"
import {createProfileModel} from "../models/profile-model.js"
import {createPaywallModel} from "../models/paywall-model.js"
import {createQuestionsModel} from "../models/questions-model.js"

// const err = (message: string) => new AuthoritarianStartupError(message)

export async function wire({
	debug,

	tokenStorage,
	paywallGuardian,
	questionsBureau,
	profileMagistrate,
	privateVimeoGovernor,
	
	loginPopupRoutine,
	decodeAccessToken,
}: AuthoritarianOptions): Promise<Supermodel> {

	//
	// instance the models
	//

	const userModel = createUserModel({
		tokenStorage,
		decodeAccessToken,
		loginPopupRoutine,
	})

	const paywallModel = createPaywallModel({
		paywallGuardian,
	})

	const profileModel = createProfileModel({
		profileMagistrate
	})

	// const avatar = createAvatarModel()

	const questionsModel = createQuestionsModel({questionsBureau})

	//
	// wire models to each other
	//

	// wire user to paywall
	paywallModel.wiring.loginWithAccessToken(userModel.wiring.loginWithAccessToken)
	userModel.subscribers.userLogin(paywallModel.wiring.receiveUserLogin)
	userModel.subscribers.userLogout(paywallModel.wiring.receiveUserLogout)
	userModel.subscribers.userError(paywallModel.wiring.receiveUserLogout)

	// wire user to profile
	userModel.subscribers.userLogin(profileModel.wiring.receiveUserLogin)
	userModel.subscribers.userError(profileModel.wiring.receiveUserLogout)
	userModel.subscribers.userLogout(profileModel.wiring.receiveUserLogout)
	userModel.subscribers.userLoading(profileModel.wiring.receiveUserLoading)

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
	userModel.subscribers.userLogin(questionsModel.wiring.receiveUserLogin)
	userModel.subscribers.userError(questionsModel.wiring.receiveUserLogout)
	userModel.subscribers.userLogout(questionsModel.wiring.receiveUserLogout)
	userModel.subscribers.userLoading(questionsModel.wiring.receiveUserLogout)
	profileModel.reader.subscribe(state =>
		questionsModel.wiring.updateProfile(state.profile))

	// //
	// // wire models to dom elements
	// //

	// profile.subscribeReset(() => {
	// 	for (const profilePanel of profilePanels)
	// 		profilePanel.reset()
	// })

	// wireStateUpdates<ProfileState, ProfilePanel>({
	// 	reader: profile.reader,
	// 	components: profilePanels,
	// 	updateComponent: (component, state) => component.profileState = state
	// })

	// wireStateUpdates<AvatarState, (ProfilePanel | AvatarDisplay)>({
	// 	reader: avatar.reader,
	// 	components: [...profilePanels, ...avatarDisplays],
	// 	updateComponent: (component, state) => component.avatarState = state
	// })

	// wireStateUpdates<PaywallState, PaywallPanel>({
	// 	reader: paywall.reader,
	// 	components: paywallPanels,
	// 	updateComponent: (component, state) => component.paywallState = state
	// })

	// wireStateUpdates<UserState, UserPanel>({
	// 	reader: user.reader,
	// 	components: userPanels,
	// 	updateComponent: (component, state) => component.userState = state
	// })

	// wireStateUpdates<QuestionsState, QuestionsForum>({
	// 	reader: questionsModel.reader,
	// 	components: questionsForums,
	// 	updateComponent: (component, state) => {
	// 		const forumName = component.getAttribute("forum-name")
	// 		if (!forumName)
	// 			throw err(`questions-forum requires attribute [forum-name]`)
	// 		const forum = state.forums[forumName] || {questions: []}
	// 		component.user = state.user
	// 		component.questions = forum.questions
	// 	}
	// })

	// for (const profilePanel of profilePanels) {
	// 	profilePanel.onProfileSave = profile.actions.saveProfile
	// }

	// for (const paywallPanel of paywallPanels) {
	// 	paywallPanel.onMakeUserPremium = paywall.actions.makeUserPremium
	// 	paywallPanel.onRevokeUserPremium = paywall.actions.revokeUserPremium
	// }

	// for (const userPanel of userPanels) {
	// 	userPanel.onLoginClick = user.actions.login
	// 	userPanel.onLogoutClick = user.actions.logout
	// }

	// for (const questionsForum of questionsForums) {
	// 	questionsForum.actions = questionsModel.actions
	// }

	// //
	// // funky complex wirings
	// //

	// for (const privateVimeo of privateVimeos) {

	// 	// require [video-name] attributes
	// 	const videoName = privateVimeo.getAttribute("video-name")
	// 	if (!videoName) err(`<private-vimeo> is missing attribute [video-name]`)

	// 	// create a model for each component
	// 	const model = createPrivateVimeoModel({
	// 		videoName,
	// 		privateVimeoGovernor
	// 	})

	// 	// wire model to other models
	// 	user.subscribers.userLogin(model.wiring.receiveUserLogin)
	// 	user.subscribers.userError(model.wiring.receiveUserLogout)
	// 	user.subscribers.userLogout(model.wiring.receiveUserLogout)
	// 	user.subscribers.userLoading(model.wiring.receiveUserLoading)

	// 	// wire model to component
	// 	privateVimeo.onUpdateVideo = model.actions.updateVideo
	// 	model.reader.subscribe(state => privateVimeo.vimeoState = state)
	// }

	// profile.wiring.publishStateUpdate()
	// avatar.wiring.publishStateUpdate()
	// paywall.wiring.publishStateUpdate()
	// user.wiring.publishStateUpdate()

	//
	// debug logging
	//

	if (debug) {
		for (const [name, subscriber] of Object.entries(userModel.subscribers))
			subscriber(() => console.debug("event.user:", name))
		paywallModel.wiring.loginWithAccessToken(
			async() => console.debug("event.paywall:", "loginWithAccessToken")
		)
	}

	//
	// return the "supermodel"
	// - contains references to all of the models
	// - might be useful for debugging
	// - could be basis of extensibility
	//

	const supermodel: Supermodel = {
		userModel,
		paywallModel,
		profileModel,
		questionsModel,
		vimeoModel: null,
		async start() {
			return userModel.wiring.start()
		}
	}

	if (debug) window["supermodel"] = supermodel
	return supermodel
}
