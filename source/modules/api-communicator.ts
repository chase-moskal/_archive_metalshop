
import {jsonCall} from "commotion"
import {ApiCommunicatorOptions} from "./interfaces"

/**
 * Communicate with the auth-server json api
 */
export default class ApiCommunicator {
	private readonly authServerUrl: string

	constructor(options: ApiCommunicatorOptions) {
		this.authServerUrl = options.authServerUrl
	}

	async apiCall<ResponseData = any>(
		resource: string,
		data: any
	): Promise<ResponseData> {
		return jsonCall({
			link: `${this.authServerUrl}/${resource}`,
			data
		})
	}
}
