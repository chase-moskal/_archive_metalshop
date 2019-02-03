
export const consoleCurry = (
	tag: string,
	consoleFunction: typeof console.log
) =>
	(...args: any[]) => consoleFunction.call(console, `[${tag}]:`, ...args)
