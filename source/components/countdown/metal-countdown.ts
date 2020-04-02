
import {LitElement, html, css, property} from "lit-element"

import {clock} from "../../system/icons.js"
import {styles} from "./metal-countdown-styles.js"
import {mixinShare} from "../../framework/share.js"
import {formatDate, formatDuration} from "./dates.js"
import { CountdownShare } from "source/interfaces.js"

const timeOffset = (new Date()).getTimezoneOffset() * 60 * 1000

const Component = mixinShare<CountdownShare, typeof LitElement>(
	LitElement
)

export class MetalCountdown extends Component {
	static get styles() { return [super.styles || css``, styles] }
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: String}) key: string
	@property({type: String}) adminValidationMessage: string = ""
	@property({type: String}) adminDate: number = NaN
	@property({type: String}) adminTime: number = NaN
	private _interval: any

	private get adminDateTime() {
		const {adminDate, adminTime} = this
		const dateTime = timeOffset + adminDate + adminTime
		return dateTime
	}

	async firstUpdated() {
		this["initially-hidden"] = false
		const {key} = this
		if (!key) throw new Error(`schedule-countdown requires [key] attribute`)
		await this.share.loadEvent(key)
		this._interval = setInterval(() => this.requestUpdate(), 1000)
		this._updateValidation()
	}

	disconnectedCallback() {
		if (this._interval !== undefined) {
			clearInterval(this._interval)
			this._interval = undefined
		}
		super.disconnectedCallback()
	}

	private _handleUpdateDate = (event: Event) => {
		const input = <HTMLInputElement>event.target
		this.adminDate = input.valueAsNumber
		this._updateValidation()
	}

	private _handleUpdateTime = (event: Event) => {
		const input = <HTMLInputElement>event.target
		this.adminTime = input.valueAsNumber
		this._updateValidation()
	}

	private _updateValidation = () => {
		const {adminDateTime} = this
		let message = "enter a valid date and time to schedule"

		if (!isNaN(adminDateTime)) {
			if ((adminDateTime) > Date.now()) {
				message = ""
			}
			else {
				message = "cannot schedule the past"
			}
		}

		this.adminValidationMessage = message
	}

	private _handleScheduleClick = async() => {
		const {adminDateTime} = this
		const eventTime = adminDateTime
		await this.share.saveEvent(this.key, eventTime)
	}

	render() {
		const {key} = this
		if (!key) return null
		const {eventTime} = this.share.events[key]
		const eventSchedule = formatDate(eventTime)
		const timeUntilEvent = eventTime - Date.now()
		const countdownDuration = formatDuration(timeUntilEvent)
		const {adminValidationMessage} = this

		return html`
			<div class="icon-area">
				${clock}
			</div>
			<div class="content-area">
				${timeUntilEvent > 0 ? html`
					<div class="countdown">
						<slot>
							<h2>Next event</h2>
						</slot>
						<p class="start-time">
							<strong>Scheduled start:</strong>
							<span>
								<span>${eventSchedule.datestring}</span>, at
								<span>${eventSchedule.timestring}</span>
								<span>(${eventSchedule.zonestring})</span>
							</span>
						</p>
						<p class="countdown-time">
							<strong>Countdown:</strong>
							<span>
								<span>${countdownDuration.days}</span>
								<span>${countdownDuration.hours}</span>
								<span>${countdownDuration.minutes}</span>
								<span>${countdownDuration.seconds}</span>
							</span>
						</p>
					</div>
				` : html`
					<div>
						<slot name="expired">
							<h2>Next event: To Be Determined</h2>
							<p>Check back soon!</p>
						</slot>
					</div>
				`}
				<metal-admin-only class="controls coolbuttonarea" block header>
					<input
						type="date"
						@keyUp=${this._handleUpdateDate}
						@change=${this._handleUpdateDate}
						@mouseUp=${this._handleUpdateDate}
					/>
					<input
						type="time"
						@keyUp=${this._handleUpdateTime}
						@change=${this._handleUpdateTime}
						@mouseUp=${this._handleUpdateTime}
					/>
					<button
						@click=${this._handleScheduleClick}
						?disabled=${!!adminValidationMessage}
						class="coolbutton schedule-button">
							Schedule
					</button>
					${adminValidationMessage ? html`
						<p class="validation">${adminValidationMessage}</p>
					` : null}
				</metal-admin-only>
			</div>
		`
	}
}
