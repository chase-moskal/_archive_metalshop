import { Logger } from "authoritarian/dist/toolbox/logger/interfaces.js";
import { MetalOptions, DecodeAccessToken } from "../interfaces.js";
export declare const makeMetalMocks: ({ startAdmin, startPremium, startLoggedIn, logger, googleUserName, decodeAccessToken, googleUserAvatar, generateRandomNickname }: {
    logger: Logger;
    startAdmin: boolean;
    startPremium: boolean;
    startLoggedIn: boolean;
    googleUserName?: string;
    googleUserAvatar?: string;
    decodeAccessToken?: DecodeAccessToken;
    generateRandomNickname?: () => string;
}) => Promise<MetalOptions>;
