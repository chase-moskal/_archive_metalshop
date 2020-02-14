
import "menutown/dist/register-all.js"
import {installAuthoritarian} from "./startup/install-authoritarian.js"

~async function() {
	const {start} = (await installAuthoritarian()).start()
	await start()
}()
