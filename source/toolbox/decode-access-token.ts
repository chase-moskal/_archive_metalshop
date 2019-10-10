
import {bdecode} from "authoritarian/dist/bdecode.js"
import {AccessPayload} from "authoritarian/dist/interfaces.js"

import {DecodeAccessToken} from "../system/interfaces.js"

/**
 * Simply read what's in an access token
 * - no logic to check expiration, or anything like that
 */
export const decodeAccessToken: DecodeAccessToken = accessToken => {
	const data = bdecode<AccessPayload>(accessToken)
	const {payload, exp} = data
	const {user} = payload
	return {exp, user, accessToken}
}
