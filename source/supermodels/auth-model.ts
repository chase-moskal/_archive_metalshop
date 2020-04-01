
import {observable, action} from "mobx"
import {AccessToken, TokenStorageTopic} from "authoritarian/dist/interfaces.js"
import {AuthMode, LoginDetail, GetAuthContext, LoginPopupRoutine, DecodeAccessToken, AuthContext, AccountShare} from "../interfaces.js"

export class AuthModel {
	@observable getAuthContext: GetAuthContext
	@observable mode: AuthMode = AuthMode.Loading
	private authContext: AuthContext
	private expiryGraceSeconds: number
	private tokenStorage: TokenStorageTopic
	private loginPopupRoutine: LoginPopupRoutine
	private decodeAccessToken: DecodeAccessToken

	constructor(options: {
		tokenStorage: TokenStorageTopic
		loginPopupRoutine: LoginPopupRoutine
		decodeAccessToken: DecodeAccessToken
		expiryGraceSeconds: number
	}) { Object.assign(this, options) }

	@action.bound async useExistingLogin() {
		this.setLoading()
		try {
			const accessToken = await this.tokenStorage.passiveCheck()
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
		const detail = this.processAccessToken(accessToken)
		await this.tokenStorage.writeAccessToken(accessToken)
		this.setLoggedIn(detail)
	}

	@action.bound async login() {
		this.setLoggedOut()
		try {
			const authTokens = await this.loginPopupRoutine()
			await this.tokenStorage.writeTokens(authTokens)
			const detail = this.processAccessToken(authTokens.accessToken)
			this.setLoggedIn(detail)
		}
		catch (error) {
			console.error(error)
		}
	}

	@action.bound async logout() {
		this.setLoading()
		try {
			await this.tokenStorage.clearTokens()
			this.authContext = null
			this.setLoggedOut()
		}
		catch (error) {
			this.setError(error)
		}
	}

	@action.bound private processAccessToken(
		accessToken: AccessToken
	): LoginDetail {
		this.authContext = this.decodeAccessToken(accessToken)
		return {
			getAuthContext: async() => {
				const gracedExp = (this.authContext.exp - this.expiryGraceSeconds)
				const expired = gracedExp < (Date.now() / 1000)
				if (expired) {
					const accessToken = await this.tokenStorage.passiveCheck()
					this.authContext = this.decodeAccessToken(accessToken)
				}
				return this.authContext
			}
		}
	}

	@action.bound private setError(error: Error) {
		this.mode = AuthMode.Error
		this.getAuthContext = null
		console.error(error)
	}

	@action.bound private setLoading() {
		this.mode = AuthMode.Loading
		this.getAuthContext = null
	}

	@action.bound private setLoggedIn({getAuthContext}: LoginDetail) {
		this.mode = AuthMode.LoggedIn
		this.getAuthContext = getAuthContext
	}

	@action.bound private setLoggedOut() {
		this.mode = AuthMode.LoggedOut
		this.getAuthContext = null
	}
}
