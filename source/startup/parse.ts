
import {AuthoritarianConfig} from "../system/interfaces.js"
import {AuthoritarianStartupError} from "../system/errors.js"

const err = (message: string) => new AuthoritarianStartupError(message)

export function parse(element: HTMLElement): AuthoritarianConfig {
	if (!element) throw err(`<authoritarian-config> required, missing`)
	return {
		mock: element.hasAttribute("mock"),
		debug: element.hasAttribute("debug"),
		authServer: element.getAttribute("auth-server"),
		profilerService: element.getAttribute("profiler-service"),
		paywallGuardian: element.getAttribute("paywall-guardian"),
	}
}
