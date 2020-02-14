
import {promises} from "fs"

export const prepareWriteToken = (dist: string) =>
	async(name: string, token: string) => promises.writeFile(
		`${dist}/${name}`,
		token,
		"utf8"
	)
