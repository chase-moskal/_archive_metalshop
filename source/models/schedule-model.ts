
import {observable, action} from "mobx"
import {ProfileMagistrateTopic, Profile} from "authoritarian/dist/interfaces.js"

import {AuthoritarianProfileError} from "../system/errors.js"
import {AuthMode, ProfileMode, GetAuthContext, AuthUpdate} from "../interfaces.js"

export class ScheduleModel {
	@observable events: {[key: string]: {
		eventTime: number
		validationMessage: string
	}} = {}


	@observable eventTime: number
	@observable validationMessage: string = ""

	@action handleAuthUpdate({user, mode, getAuthContext}: AuthUpdate) {
		
	}
}
