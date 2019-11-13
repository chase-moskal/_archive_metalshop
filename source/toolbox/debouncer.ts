
export class Debouncer {
	private _delay: number
	private _action: () => void
	private _timeout: any = null

	constructor({action, delay}: {
		delay: number
		action: () => void
	}) {
		this._action = action
		this._delay = delay
	}

	queue = () => {
		if (this._timeout !== null) {
			clearTimeout(this._timeout)
			this._timeout = null
		}
		this._timeout = setTimeout(() => {
			this._action()
			this._timeout = null
		}, this._delay)
	}
}
