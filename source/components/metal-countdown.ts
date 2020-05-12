
import {clock} from "../system/icons.js"
import {CountdownShare} from "../interfaces.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {styles} from "./styles/metal-countdown-styles.js"
import {formatDate, formatDuration} from "../toolbox/dates.js"
import {MetalshopComponent, property, html} from "../framework/metalshop-component.js"

const timeOffset = (new Date()).getTimezoneOffset() * 60 * 1000

 @mixinStyles(styles)
export class MetalCountdown extends MetalshopComponent<CountdownShare> {
	@property({type: String}) ["event-name"]: string
	@property({type: String}) adminDate: number = NaN
	@property({type: String}) adminTime: number = NaN
	@property({type: String}) adminValidationMessage: string = ""
	private _interval: any

	async firstUpdated(props) {
		super.firstUpdated(props)
		const {["event-name"]: eventName} = this
		if (!eventName) throw new Error(`schedule-countdown requires [event-name] attribute`)
		await this.share.loadEvent(eventName)
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

	render() {
		const {["event-name"]: eventName} = this
		if (!eventName) return null
		const time = this.share.events[eventName]?.time
		const scheduled: boolean = time !== undefined
			&& ((time - Date.now()) > 0)
		return html`
			<div class="icon-area">
				${clock}
			</div>
			<div class="content-area">
				${scheduled
					? this.renderScheduled({time, timeUntilEvent: time - Date.now()})
					: this.renderUnscheduled()}
				${this.renderAdminPanel({scheduled})}
			</div>
		`
	}

	private renderScheduled({time, timeUntilEvent}: {
		time: number
		timeUntilEvent: number
	}) {
		const eventSchedule = formatDate(time)
		const countdownDuration = formatDuration(timeUntilEvent)
		return html`
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
		`
	}

	private renderUnscheduled() {
		return html`
			<div>
				<slot name="unscheduled">
					<h2>Next event: To Be Determined</h2>
					<p>Check back soon!</p>
				</slot>
			</div>
		`
	}

	private renderAdminPanel({scheduled}: {scheduled: boolean}) {
		const {adminValidationMessage} = this
		return html`
			<metal-is-admin fancy class="controls coolbuttonarea">
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
					class="coolbutton schedule-button"
					@click=${this._handleScheduleClick}
					?disabled=${!!adminValidationMessage}>
						Schedule
				</button>
				<button
					class="coolbutton unschedule-button"
					?disabled=${!scheduled}
					@click=${this._handleUnscheduleClick}>
						Unschedule
				</button>
				${adminValidationMessage ? html`
					<p class="validation">${adminValidationMessage}</p>
				` : null}
			</metal-is-admin>
		`
	}

	private get adminDateTime() {
		const {adminDate, adminTime} = this
		const dateTime = timeOffset + adminDate + adminTime
		return dateTime
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
		const {adminDateTime: time, ["event-name"]: eventName} = this
		await this.share.saveEvent(eventName, {time})
	}

	private _handleUnscheduleClick = async() => {
		const {["event-name"]: eventName} = this
		await this.share.saveEvent(eventName, undefined)
	}
}
