var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { clock } from "../system/icons.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { styles } from "./styles/metal-countdown-styles.js";
import { formatDate, formatDuration } from "../toolbox/dates.js";
import { MetalshopComponent, property, html } from "../framework/metalshop-component.js";
const timeOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
let MetalCountdown = class MetalCountdown extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.adminDate = NaN;
        this.adminTime = NaN;
        this.adminValidationMessage = "";
        this._handleUpdateDate = (event) => {
            const input = event.target;
            this.adminDate = input.valueAsNumber;
            this._updateValidation();
        };
        this._handleUpdateTime = (event) => {
            const input = event.target;
            this.adminTime = input.valueAsNumber;
            this._updateValidation();
        };
        this._updateValidation = () => {
            const { adminDateTime } = this;
            let message = "enter a valid date and time to schedule";
            if (!isNaN(adminDateTime)) {
                if ((adminDateTime) > Date.now()) {
                    message = "";
                }
                else {
                    message = "cannot schedule the past";
                }
            }
            this.adminValidationMessage = message;
        };
        this._handleScheduleClick = async () => {
            const { adminDateTime: time, ["event-name"]: eventName } = this;
            await this.share.saveEvent(eventName, { time });
        };
        this._handleUnscheduleClick = async () => {
            const { ["event-name"]: eventName } = this;
            await this.share.saveEvent(eventName, undefined);
        };
    }
    async firstUpdated(props) {
        super.firstUpdated(props);
        const { ["event-name"]: eventName } = this;
        if (!eventName)
            throw new Error(`schedule-countdown requires [event-name] attribute`);
        await this.share.loadEvent(eventName);
        this._interval = setInterval(() => this.requestUpdate(), 1000);
        this._updateValidation();
    }
    disconnectedCallback() {
        if (this._interval !== undefined) {
            clearInterval(this._interval);
            this._interval = undefined;
        }
        super.disconnectedCallback();
    }
    render() {
        const { ["event-name"]: eventName } = this;
        if (!eventName)
            return null;
        const time = this.share.events[eventName]?.time;
        const scheduled = time !== undefined
            && ((time - Date.now()) > 0);
        return html `
			<div class="icon-area">
				${clock}
			</div>
			<div class="content-area">
				${scheduled
            ? this.renderScheduled({ time, timeUntilEvent: time - Date.now() })
            : this.renderUnscheduled()}
				${this.renderAdminPanel({ scheduled })}
			</div>
		`;
    }
    renderScheduled({ time, timeUntilEvent }) {
        const eventSchedule = formatDate(time);
        const countdownDuration = formatDuration(timeUntilEvent);
        return html `
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
		`;
    }
    renderUnscheduled() {
        return html `
			<div>
				<slot name="unscheduled">
					<h2>Next event: To Be Determined</h2>
					<p>Check back soon!</p>
				</slot>
			</div>
		`;
    }
    renderAdminPanel({ scheduled }) {
        const { adminValidationMessage } = this;
        return html `
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
				${adminValidationMessage ? html `
					<p class="validation">${adminValidationMessage}</p>
				` : null}
			</metal-is-admin>
		`;
    }
    get adminDateTime() {
        const { adminDate, adminTime } = this;
        const dateTime = timeOffset + adminDate + adminTime;
        return dateTime;
    }
};
__decorate([
    property({ type: String })
], MetalCountdown.prototype, "event-name", void 0);
__decorate([
    property({ type: String })
], MetalCountdown.prototype, "adminDate", void 0);
__decorate([
    property({ type: String })
], MetalCountdown.prototype, "adminTime", void 0);
__decorate([
    property({ type: String })
], MetalCountdown.prototype, "adminValidationMessage", void 0);
MetalCountdown = __decorate([
    mixinStyles(styles)
], MetalCountdown);
export { MetalCountdown };
//# sourceMappingURL=metal-countdown.js.map