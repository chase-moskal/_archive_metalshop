
import {LitElement, html, css, property} from "lit-element"

import {mixinModelSubscription} from "../../framework/mixin-model-subscription.js"

import {styles} from "./schedule-countdown-styles.js"
import {ScheduleModel, CountdownModel} from "../../interfaces.js"

export class ScheduleCountdown extends
	mixinModelSubscription<ScheduleModel, typeof LitElement>(
		LitElement
	)
{
	static get styles() { return [super.styles || css``, styles] }
	@property({type: String}) key: string
	private _countdownModel: CountdownModel

	async firstUpdated() {
		const {key, model} = this
		if (!key) throw new Error(`schedule-countdown requires [key] attribute`)
		const countdownModel = this._countdownModel
			= model.prepareCountdownModel({key})
		this.subscribeToReader(countdownModel.reader)
		await countdownModel.refreshEventTime()
	}

	render() {
		if (!this._countdownModel) return html`nop`
		const {state} = this._countdownModel.reader
		return html`
			<div class="countdown">
				<p>Countdown!</p>
				<p>${state.eventTime}</p>
			</div>
			${state.admin ? html`
				<div class="admin">
					<p>ADMIN</p>
				</div>
			` : null}
		`
	}
}
