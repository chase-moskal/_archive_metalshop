
import {AuthoritarianConfig} from "../system/interfaces.js"
import {AuthoritarianStartupError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export function parse(element: HTMLElement): AuthoritarianConfig {
	if (!element) throw err(`<authoritarian-config> required, missing`)
	return {
		mock: element.getAttribute("mock"),
		debug: element.hasAttribute("debug"),
		authServer: element.getAttribute("auth-server"),
		profileServer: element.getAttribute("profile-server"),
		paywallServer: element.getAttribute("paywall-server"),
		privateVimeoServer: element.getAttribute("private-vimeo-server"),
		questionsForumServer: element.getAttribute("questions-forum-server"),
	}
}
