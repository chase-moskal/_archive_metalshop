
import "menutown/dist/register-all.js"
import {installAuthoritarian} from "./startup/install-authoritarian.js"

;(async() => {
	const {start} = await installAuthoritarian()
	await start()
})()
