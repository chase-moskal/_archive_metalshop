
import {observable, action} from "mobx"
import * as loading from "../toolbox/loading.js"
import {User, AccessToken, TokenStoreTopic} from "authoritarian/dist/interfaces.js"
import {AuthPayload, TriggerAccountPopup, DecodeAccessToken, AuthContext, GetAuthContext} from "../interfaces.js"

export class AuthModel {

	//
	// public observables
	//

	@observable user: User = null
	@observable getAuthContext: GetAuthContext = null
	@observable authLoad = loading.load<AuthPayload>()

	//
	// private state
	//

	private authContext: AuthContext
	private expiryGraceSeconds: number
	private tokenStore: TokenStoreTopic
	private decodeAccessToken: DecodeAccessToken
	private triggerAccountPopup: TriggerAccountPopup

	constructor(options: {
			expiryGraceSeconds: number
			tokenStore: TokenStoreTopic
			decodeAccessToken: DecodeAccessToken
			triggerAccountPopup: TriggerAccountPopup
		}) {
		Object.assign(this, options)
	}

	//
	// public functions
	//

	 @action.bound
	async useExistingLogin() {
		this.setLoading()
		try {
			const accessToken = await this.tokenStore.passiveCheck()
			if (accessToken) {
				const detail = this.processAccessToken(accessToken)
				this.setLoggedIn(detail)
			}
			else this.setLoggedOut()
		}
		catch (error) {
			this.setError(error)
		}
	}

	 @action.bound
	async loginWithAccessToken(accessToken: AccessToken) {
		await this.tokenStore.writeAccessToken(accessToken)
		if (accessToken) {
			const payload = this.processAccessToken(accessToken)
			this.setLoggedIn(payload)
		}
		else {
			this.setLoggedOut()
		}
	}

	 @action.bound
	async login() {
		this.setLoading()
		try {
			const authTokens = await this.triggerAccountPopup()
			await this.tokenStore.writeTokens(authTokens)
			const payload = this.processAccessToken(authTokens.accessToken)
			this.setLoggedIn(payload)
		}
		catch (error) {
			console.error(error)
		}
	}

	 @action.bound
	async logout() {
		this.setLoading()
		try {
			await this.tokenStore.clearTokens()
			this.authContext = null
			this.setLoggedOut()
		}
		catch (error) {
			this.setError(error)
		}
	}

	 @action.bound
	async reauthorize() {
		this.setLoading()
		try {
			await this.tokenStore.writeAccessToken(null)
			this.authContext = null
			await this.useExistingLogin()
		}
		catch (error) {
			this.setError(error)
		}
	}

	//
	// private methods
	//

	 @action.bound
	private processAccessToken(accessToken: AccessToken): AuthPayload {
		this.authContext = this.decodeAccessToken(accessToken)
		this.user = this.authContext?.user
		const getAuthContext = async() => {
			const gracedExp = (this.authContext.exp - this.expiryGraceSeconds)
			const expired = gracedExp < (Date.now() / 1000)
			if (expired) {
				const accessToken = await this.tokenStore.passiveCheck()
				this.authContext = this.decodeAccessToken(accessToken)
				this.user = this.authContext?.user
			}
			return this.authContext
		}
		return {getAuthContext, user: this.user}
	}

	 @action.bound
	private setError(error: Error) {
		this.user = null
		this.getAuthContext = null
		this.authLoad = loading.error(undefined)
		console.error(error)
	}

	 @action.bound
	private setLoading() {
		this.user = null
		this.getAuthContext = null
		this.authLoad = loading.loading()
	}

	 @action.bound
	private setLoggedIn({user, getAuthContext}: AuthPayload) {
		this.getAuthContext = getAuthContext
		this.authLoad = loading.ready({user, getAuthContext})
	}

	 @action.bound
	private setLoggedOut() {
		this.user = null
		this.getAuthContext = null
		this.authLoad = loading.ready({user: null, getAuthContext: null})
	}
}

// // reimagined in functional style...
// export function makeAuthModel({
// 		tokenStore,
// 		decodeAccessToken,
// 		expiryGraceSeconds,
// 		triggerAccountPopup,
// 	}: {
// 		expiryGraceSeconds: number
// 		tokenStore: TokenStoreTopic
// 		decodeAccessToken: DecodeAccessToken
// 		triggerAccountPopup: TriggerAccountPopup
// 	}) {

// 	const observables = observelize({
// 		user: <User>null,
// 		getAuthContext: <GetAuthContext>null,
// 		authLoad: loading.load<AuthPayload>(),
// 	})

// 	const privateActions = actionelize({
// 		processAccessToken() {},
// 		setError() {},
// 		setLoading() {},
// 		setLoggedIn() {},
// 		setLoggedOut() {},
// 	})

// 	const actions = actionelize({
// 		async login() {},
// 		async logout() {},
// 		async useExistingLogin() {},
// 		async loginWithAccessToken() {},
// 	})

// 	return {observables, actions}
// }
