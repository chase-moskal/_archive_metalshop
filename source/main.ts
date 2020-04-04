
import "menutown/dist/register-all.js"
import {installMetalshop} from "./startup/install-metalshop.js"

~async function() {
	const {supermodel, start} = await installMetalshop()
	window["supermodel"] = supermodel
	await start()
}()
