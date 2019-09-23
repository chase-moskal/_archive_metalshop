
import {createIframe} from "crosscall/dist/create-iframe.js"
import {TokenStorageTopic} from "authoritarian/dist/interfaces.js"
import {Client as CrosscallClient} from "crosscall/dist/client.js"

const namespace = "authoritarian-token-storage"

export async function prepareTokenStorageClient(authServerUrl: string) {
	const {origin: tokenStorageOrigin} = new URL(authServerUrl)
	const {postMessage} = await createIframe({url: `${tokenStorageOrigin}/html/token-storage`})
	const {callable} = new CrosscallClient({
		postMessage,
		hostOrigin: tokenStorageOrigin,
		namespace: namespace,
	})
	const {topics} = <any>(await callable)
	return <TokenStorageTopic><any>topics.tokenStorage
}
