
import {observable, action} from "mobx"
import * as loading from "../toolbox/loading.js"
import {AccessToken, TokenStoreTopic} from "authoritarian/dist/interfaces.js"
import {AuthPayload, TriggerAccountPopup, DecodeAccessToken, AuthContext} from "../interfaces.js"


export class AuthModel {
	@observable authLoad = loading.load<AuthPayload>()
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

	@action.bound async useExistingLogin() {
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

	@action.bound async loginWithAccessToken(accessToken: AccessToken) {
		await this.tokenStore.writeAccessToken(accessToken)
		if (accessToken) {
			const detail = this.processAccessToken(accessToken)
			this.setLoggedIn(detail)
		}
		else {
			this.setLoggedOut()
		}
	}

	@action.bound async login() {
		this.setLoggedOut()
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

	@action.bound async logout() {
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

	@action.bound private processAccessToken(
			accessToken: AccessToken
		): AuthPayload {
		this.authContext = this.decodeAccessToken(accessToken)
		return {
			getAuthContext: async() => {
				const gracedExp = (this.authContext.exp - this.expiryGraceSeconds)
				const expired = gracedExp < (Date.now() / 1000)
				if (expired) {
					const accessToken = await this.tokenStore.passiveCheck()
					this.authContext = this.decodeAccessToken(accessToken)
				}
				return this.authContext
			}
		}
	}

	@action.bound private setError(error: Error) {
		console.error(error)
		this.authLoad = loading.error(undefined)
	}

	@action.bound private setLoading() {
		this.authLoad = loading.loading()
	}

	@action.bound private setLoggedIn({getAuthContext}: AuthPayload) {
		this.authLoad = loading.ready({getAuthContext})
	}

	@action.bound private setLoggedOut() {
		this.authLoad = loading.ready({getAuthContext: null})
	}
}
