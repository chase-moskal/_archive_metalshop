
import {AccessToken, AccessData} from "authoritarian"

/** Handle the reception of an access token */
export type HandleAccessToken = (accessToken?: AccessToken) => void

/** Handle the reception of decoded access data */
export type HandleAccessData = (accessData: AccessData) => void

/** Decode access data out of an access token */
export type DecodeAccessToken = (accessToken: AccessToken) => AccessData
