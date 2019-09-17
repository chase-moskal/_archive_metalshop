
import {AuthContext, Profile} from "./interfaces.js"
import {
	Dispatcher,
	dashifyEventName,
	prepareEventDecorator,
} from "./toolbox/event-decorator.js"

export const event = prepareEventDecorator({
	bubbles: true,
	composed: true
})

export class UserLoginEvent extends CustomEvent<AuthContext> {}
export class UserLogoutEvent extends CustomEvent<{}> {}
export class ProfileLoadedEvent extends CustomEvent<Profile> {}

export {Dispatcher, dashifyEventName}
