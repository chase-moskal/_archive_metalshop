
import {AuthoritarianConfig} from "../system/interfaces.js"

export function parseConfigElement(element: HTMLElement): AuthoritarianConfig {
	if (!element) throw new Error(`authoritarian: config element missing`)
	return {
		mock: element.hasAttribute("mock"),
		debug: element.hasAttribute("debug"),
		authServer: element.getAttribute("auth-server"),
		profilerService: element.getAttribute("profiler-service"),
		paywallGuardian: element.getAttribute("paywall-guardian"),
	}
}
