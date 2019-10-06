
import {DecodeAccessToken} from "../system/interfaces.js"
import {bdecode} from "authoritarian/dist/bdecode.js"
import {AccessPayload} from "authoritarian/dist/interfaces.js"

export const decodeAccessToken: DecodeAccessToken = accessToken => {
	const data = bdecode<AccessPayload>(accessToken)
	const {payload, exp} = data
	const {user} = payload
	return {exp, user, accessToken}
}
