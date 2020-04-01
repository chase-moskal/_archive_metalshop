
import {MetalConfig} from "../../interfaces.js"
import {AuthoritarianStartupError} from "../../system/errors.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export function parse(element: HTMLElement): MetalConfig {
	if (!element) throw err(`<metal-config> required, missing`)
	return {
		mock: element.getAttribute("mock"),
		authServer: element.getAttribute("auth-server"),
		liveshowServer: element.getAttribute("vimeo-server"),
		profileServer: element.getAttribute("profile-server"),
		paywallServer: element.getAttribute("paywall-server"),
		scheduleServer: element.getAttribute("schedule-server"),
		questionsServer: element.getAttribute("questions-server"),
	}
}
