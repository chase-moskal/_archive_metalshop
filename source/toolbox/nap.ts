
export const nap = (multiplier: number = 1) =>
	new Promise(resolve => setTimeout(resolve, multiplier * 250))
