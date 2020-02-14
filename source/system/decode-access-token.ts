
import {DecodeAccessToken} from "../interfaces.js"
import {tokenDecode} from "redcrypto/dist/token-decode.js"
import {AccessPayload} from "authoritarian/dist/interfaces.js"

/**
 * Simply read what's in an access token
 * - no logic to check expiration, or anything like that
 */
export const decodeAccessToken: DecodeAccessToken = accessToken => {
	const data = tokenDecode<AccessPayload>(accessToken)
	const {payload, exp} = data
	const {user} = payload
	return {exp, user, accessToken}
}
