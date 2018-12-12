
import {jsonCall} from "commotion"

const linkbase = "http://localhost:8075"

export async function apiCall<ResponseData = any>(
	resource: string,
	data: any
): Promise<ResponseData> {
	return jsonCall({link: `${linkbase}/${resource}`, data})
}
