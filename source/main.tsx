
import installAuthPanel from "./modules/install-auth-panel"

main().catch(error => console.error(error))

async function main() {
	installAuthPanel({
		authServerOrigin: "http://localhost:8080",
		replaceElement: document.querySelector(".auth-panel")
	})
	console.log("🤖")
}

