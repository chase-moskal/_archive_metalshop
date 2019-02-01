
import {jsonCall} from "commotion"

import {ApiCommunicatorOptions} from "./interfaces"

/**
 * Communicate with the auth-server json api
 */
export default class ApiCommunicator {
	private readonly authServerOrigin: string

	constructor(options: ApiCommunicatorOptions) {
		this.authServerOrigin = options.authServerOrigin
	}

	async apiCall<ResponseData = any>(
		resource: string,
		data: any
	): Promise<ResponseData> {
		return jsonCall({
			link: `${this.authServerOrigin}/${resource}`,
			data
		})
	}
}
