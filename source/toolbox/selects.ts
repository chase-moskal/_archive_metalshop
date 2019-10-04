
export function select<H extends HTMLElement = HTMLElement>(selector: string, context: any = document): H {
	return document.querySelector(selector)
}

export function selects<H extends HTMLElement = HTMLElement>(
	selector: string,
	context: any = document
): H[] {
	return Array.from(document.querySelectorAll(selector))
}
