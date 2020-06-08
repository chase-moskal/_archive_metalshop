
import {observable, action} from "mobx"
import {Persona, AdminSearchTopic} from "authoritarian/dist/interfaces.js"

import * as loading from "../toolbox/loading.js"
import {AuthPayload, GetAuthContext} from "../interfaces.js"

export class SeekerModel {
	@observable resultsLoad: loading.Load<Persona[]> = loading.ready([])

	private adminSearch: AdminSearchTopic
	private getAuthContext: GetAuthContext
	constructor({adminSearch}: {adminSearch: AdminSearchTopic}) {
		this.adminSearch = adminSearch
	}

	@action handleAuthLoad = (load: loading.Load<AuthPayload>) => {
		this.getAuthContext = loading.payload(load)?.getAuthContext
	}

	@action query = async(needle: string) => {
		if (!needle) {
			this.resultsLoad = loading.ready([])
			return
		}
		this.resultsLoad = loading.loading()
		try {
			const {accessToken} = await this.getAuthContext()
			const results = await this.adminSearch.search({accessToken, needle})
			this.resultsLoad = loading.ready(results)
		}
		catch (error) {
			this.resultsLoad = loading.error(`query error`)
		}
	}
}
