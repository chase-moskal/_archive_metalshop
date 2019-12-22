
import {makeReader} from "../toolbox/pubsub.js"

import {
	UserModel,
	UserState,
	ScheduleModel,
	CountdownState,
	GetAuthContext,
	ScheduleSentryTopic,
	CountdownModel,
} from "../interfaces.js"

import {UserMode} from "./user-model.js"

export function createScheduleModel({user, scheduleSentry}: {
	user: UserModel
	scheduleSentry: ScheduleSentryTopic
}): ScheduleModel {
	let getAuthContext: GetAuthContext

	function prepareCountdownModel({key}: {key: string}): CountdownModel {
		const state: CountdownState = {
			admin: false,
			eventTime: null,
			validationMessage: "",
		}

		const {reader, update} = makeReader(state)

		const countdownModel = {
			reader,
			async refreshEventTime() {
				const time = await scheduleSentry.getEventTime(key)
				state.eventTime = time
				update()
			},
			async setEventTime(time: number) {
				await scheduleSentry.setEventTime(key, time)
				state.eventTime = time
				update()
			},
			async receiveUserUpdate({mode}: UserState) {
				if (mode === UserMode.LoggedIn) {
					const {user} = await getAuthContext()
					state.admin = user.public.claims.admin
				}
				else {
					state.admin = false
				}
				update()
			}
		}

		user.reader.subscribe(state => {
			getAuthContext = state.getAuthContext
			countdownModel.receiveUserUpdate(state)
		})

		countdownModel.receiveUserUpdate(user.reader.state)

		return countdownModel
	}

	return {prepareCountdownModel}
}
