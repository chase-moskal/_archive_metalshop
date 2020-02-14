
import {LitElement, html, css, property} from "lit-element"

import {clock} from "../../system/icons.js"
import {ScheduleModel, CountdownModel} from "../../interfaces.js"
import {mixinModelSubscription}
	from "../../framework/mixin-model-subscription.js"

import {formatDate, formatDuration} from "./dates.js"
import {styles} from "./schedule-countdown-styles.js"

const timeOffset = (new Date()).getTimezoneOffset() * 60 * 1000

const Component = mixinModelSubscription<ScheduleModel, typeof LitElement>(
	LitElement
)

export class ScheduleCountdown extends Component {
	static get styles() { return [super.styles || css``, styles] }
	@property({type: Boolean, reflect: true}) ["initially-hidden"]: boolean
	@property({type: String}) key: string
	@property({type: String}) adminValidationMessage: string = ""
	@property({type: String}) adminDate: number = NaN
	@property({type: String}) adminTime: number = NaN
	private _countdownModel: CountdownModel
	private _timer: any

	private get adminDateTime() {
		const {adminDate, adminTime} = this
		const dateTime = timeOffset + adminDate + adminTime
		return dateTime
	}

	async firstUpdated() {
		this["initially-hidden"] = false
		const {key, model} = this
		if (!key) throw new Error(`schedule-countdown requires [key] attribute`)
		const countdownModel = this._countdownModel
			= model.prepareCountdownModel({key})
		this.subscribeToReader(countdownModel.reader)
		await countdownModel.refreshEventTime()
		this._timer = setInterval(() => this.requestUpdate(), 1000)
		this._updateValidation()
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
		const time = adminDateTime
		await this._countdownModel.setEventTime(time)
	}

	render() {
		if (!this._countdownModel) return html``
		const {eventTime, admin} = this._countdownModel.reader.state
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
				${admin ? html`
					<div class="admin">
						<p>Admin controls</p>
						<div class="controls coolbuttonarea">
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
						</div>
					</div>
				` : null}
			</div>
		`
	}
}
