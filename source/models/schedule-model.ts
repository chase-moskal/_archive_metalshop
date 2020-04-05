
import {observable, action} from "mobx"
import {GetAuthContext, AuthUpdate} from "../interfaces.js"
import {ScheduleSentryTopic, ScheduleEvent} from "authoritarian/dist/interfaces.js"

export class ScheduleModel {
	@observable events: {[name: string]: ScheduleEvent} = {}
	private getAuthContext: GetAuthContext
	private scheduleSentry: ScheduleSentryTopic

	constructor(options: {
		scheduleSentry: ScheduleSentryTopic
	}) { Object.assign(this, options) }

	@action.bound async handleAuthUpdate({getAuthContext}: AuthUpdate) {
		this.getAuthContext = getAuthContext
	}

	@action.bound async loadEvent(name: string): Promise<ScheduleEvent> {
		const event = await this.scheduleSentry.getEvent({name})
		if (event) this.cacheEvent(name, event)
		return event
	}

	@action.bound async saveEvent(name: string, event: ScheduleEvent): Promise<void> {
		const {accessToken} = await this.getAuthContext()
		await this.scheduleSentry.setEvent({accessToken, name, event})
		this.cacheEvent(name, event)
	}

	private cacheEvent(name: string, event: ScheduleEvent) {
		this.events[name] = event
	}
}
