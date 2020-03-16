
import "menutown/dist/register-all.js"
import {installMetalshop} from "./startup/install-metalshop.js"

~async function() {
	const {start} = await installMetalshop()
	await start()
}()
