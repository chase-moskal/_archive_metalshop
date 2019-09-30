import { tokenDecode } from "redcrypto/dist/token-decode.js";
/**
 * Simply read what's in an access token
 * - no logic to check expiration, or anything like that
 */
export const decodeAccessToken = accessToken => {
    const data = tokenDecode(accessToken);
    const { payload, exp } = data;
    const { user } = payload;
    return { exp, user, accessToken };
};
//# sourceMappingURL=decode-access-token.js.map