
import {UserPanel} from "../components/user-panel.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {AvatarDisplay} from "../components/avatar-display.js"
import {PrivateLivestream} from "../components/private-livestream.js"

import {mixinCss} from "../toolbox/mixin-css.js"
import {registerComponents} from "../toolbox/register-components.js"

import {theme} from "./theme.js"

registerComponents({
	UserPanel: mixinCss(theme, UserPanel),
	ProfilePanel: mixinCss(theme, ProfilePanel),
	PaywallPanel: mixinCss(theme, PaywallPanel),
	AvatarDisplay: mixinCss(theme, AvatarDisplay),
	PrivateLivestream: mixinCss(theme, PrivateLivestream),
})
