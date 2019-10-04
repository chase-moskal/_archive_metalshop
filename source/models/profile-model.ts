
import {AuthContext} from "../interfaces.js"
import {ProfilerTopic, Profile} from "authoritarian/dist/interfaces.js"
import {createEventListener} from "../toolbox/create-event-listener.js"
import {createEventDispatcher} from "../toolbox/create-event-dispatcher.js"

import {
	UserLoginEvent,
	UserLogoutEvent,
	UserLoadingEvent,
	ProfileErrorEvent,
	ProfileUpdateEvent,
} from "../events.js"

import {Dispatcher} from "event-decorators"

export function createProfileModel({profiler, eventTarget = document.body}: {
	profiler: ProfilerTopic
	eventTarget: EventTarget
}) {

	//
	// privates
	//

	let cancel: boolean = false
	const bubbling: CustomEventInit = {bubbles: true, composed: true}
	const listening: AddEventListenerOptions = {
		capture: false, once: false, passive: false
	}

	async function loadProfile(authContext: AuthContext): Promise<Profile> {
		const {accessToken} = authContext
		const profile = await profiler.getFullProfile({accessToken})
		if (!profile) console.warn("failed to load profile")
		return profile
	}

	//
	// event dispatchers,
	// functions which can dispatch events
	//

	const dispatchProfileError: Dispatcher<ProfileErrorEvent> =
		createEventDispatcher<ProfileErrorEvent>(
			ProfileErrorEvent,
			eventTarget,
			bubbling,
		)

	const dispatchProfileUpdate: Dispatcher<ProfileUpdateEvent> =
		createEventDispatcher<ProfileUpdateEvent>(
			ProfileUpdateEvent,
			eventTarget,
			bubbling,
		)

	//
	// event listeners,
	// process user events, load profiles, and dispatch profile events
	//

	const listeners: (() => void)[] = [
		createEventListener<UserLoadingEvent>(
			UserLoadingEvent, eventTarget, listening,
			async() => {
				cancel = true
			}
		),
		createEventListener<UserLoginEvent>(
			UserLoginEvent, eventTarget, listening,
			async event => {
				cancel = false
				try {
					const authContext = await event.detail.getAuthContext()
					const profile = await loadProfile(authContext)
					if (!cancel)
						dispatchProfileUpdate({detail: {profile}})
					else
						dispatchProfileUpdate({detail: {profile: null}})
				}
				catch (error) {
					dispatchProfileError({detail: {error}})
				}
			}
		),
		createEventListener<UserLogoutEvent>(
			UserLogoutEvent, eventTarget, listening,
			async() => {
				const profile = null
				dispatchProfileUpdate({detail: {profile}})
			}
		)
	]

	//
	// public
	//

	return {
		removeListeners() {
			for (const remove of listeners) remove()
		}
	}
}
