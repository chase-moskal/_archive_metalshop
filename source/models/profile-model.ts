
import {AuthContext} from "../interfaces.js"
import {ProfilerTopic, Profile} from "authoritarian/dist/interfaces.js"
import {createEventListener} from "../toolbox/create-event-listener.js"
import {createEventDispatcher} from "../toolbox/create-event-dispatcher.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	UserLoadingEvent,
	ProfileUpdateEvent,
} from "../events.js"

import {Dispatcher} from "event-decorators"

const bubbling: CustomEventInit = {bubbles: true, composed: true}
const listening: AddEventListenerOptions = {capture: false, once: false, passive: false}

export class ProfileModel {
	private _listeners: (() => void)[] = []
	private readonly _profiler: ProfilerTopic

	private _dispatchProfileUpdate: Dispatcher<ProfileUpdateEvent>

	constructor({profiler, eventTarget = document.body}: {
		profiler: ProfilerTopic
		eventTarget: EventTarget
	}) {
		this._profiler = profiler

		this._dispatchProfileUpdate = createEventDispatcher<ProfileUpdateEvent>(
			ProfileUpdateEvent,
			eventTarget,
			bubbling
		)

		this._listeners = [
			createEventListener<UserLoginEvent>(
				UserLoginEvent, eventTarget, listening,
				async event => {
					const authContext = await event.detail.getAuthContext()
					const profile = await this._loadProfile(authContext)
					this._dispatchProfileUpdate({detail: {profile}})
				}
			),
			createEventListener<UserLogoutEvent>(
				UserLogoutEvent, eventTarget, listening,
				async() => {
					const profile = null
					this._dispatchProfileUpdate({detail: {profile}})
				}
			)
		]
	}

	destructor() {
		for (const remove of this._listeners) remove()
	}

	private async _loadProfile(authContext: AuthContext) {
		const {accessToken} = authContext
		const profile = await this._profiler.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		return profile
	}
}
