
import {observable, action} from "mobx"
import {ScheduleSentryTopic, ScheduleEvent} from "../interfaces.js"

export class ScheduleModel {
	@observable events: {[key: string]: ScheduleEvent} = {}
	private scheduleSentry: ScheduleSentryTopic

	constructor(options: {
		scheduleSentry: ScheduleSentryTopic
	}) { Object.assign(this, options) }

	@action.bound async loadEvent(key: string): Promise<ScheduleEvent> {
		const eventTime = await this.scheduleSentry.getEventTime(key)
		return this.cacheEvent(key, eventTime)
	}

	@action.bound async saveEvent(
		key: string,
		eventTime: number
	): Promise<ScheduleEvent> {
		await this.scheduleSentry.setEventTime(key, eventTime)
		return this.cacheEvent(key, eventTime)
	}

	private cacheEvent(key: string, eventTime: number) {
		const existing = this.events[key]
		const event: ScheduleEvent = existing
			? {...existing, eventTime}
			: {eventTime}
		this.events[key] = event
		return event
	}
}
