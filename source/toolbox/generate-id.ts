
export function generateId(n = 1) {
	n -= 1
	return Math.random().toString(36).substring(2)
		+ (n > 0 ? generateId(n) : "")
}
