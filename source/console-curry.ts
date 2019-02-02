
export const consoleCurry = ({consoleFunction, tag}: {
	consoleFunction: typeof console.log
	tag: string
}) =>
	(...args: any[]) => consoleFunction.call(console, `[${tag}]:`, ...args)
