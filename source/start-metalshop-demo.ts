
import "menutown/dist/register-all.js"

import {parseQuery} from "./toolbox/parse-query.js"
import {installMetalshop} from "./install-metalshop.js"
import {registerComponents} from "./toolbox/register-components.js"
import {demoComponents} from "./components/demos/all-demo-components.js"

function modifyMetalConfigBasedOnQueryParams() {
	const query = parseQuery<{mock: string; dev: string; menu: string}>()
	const config = document.querySelector("metal-config")
	const attr = (key: string, value: string) => config.setAttribute(key, value)
	if (query.mock !== undefined) {
		attr("mock", query.mock)
		if (query.mock.includes("open")) {
			setTimeout(() =>{
				document.querySelector<any>(
					"menu-system > menu-display:nth-child(1)"
				)?.toggle()
			}, 0)
		}
	}
	if (query.dev !== undefined) {
		// dev is running minikube local kubernetes cluster in dev mode
		if (query.dev === "minikube") {
			attr("auth-server", "http://auth.metaldev.chasemoskal.com")
			attr("profile-server", "http://profile.metaldev.chasemoskal.com")
			attr("questions-server", "http://questions.metaldev.chasemoskal.com")
		}
		// dev is running each microservice on a different port
		else if (query.dev === "node") {
			attr("auth-server", "http://auth.metaldev.chasemoskal.com:8000")
			attr("profile-server", "http://profile.metaldev.chasemoskal.com:8001")
			attr("questions-server", "http://questions.metaldev.chasemoskal.com:8002")
		}
		// user is connecting to the production kubernetes cluster
		else {
			attr("auth-server", "https://auth.metalback.chasemoskal.com")
			attr("profile-server", "https://profile.metalback.chasemoskal.com")
			attr("questions-server", "https://questions.metalback.chasemoskal.com")
		}
	}
}

~async function startMetalshopDemo() {
	modifyMetalConfigBasedOnQueryParams()

	const metalshop = await installMetalshop()
	window["metalshop"] = metalshop

	registerComponents({
		...metalshop.components,
		...demoComponents,
	})

	await metalshop.start()
}()
