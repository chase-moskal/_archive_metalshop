
import {UserPanel} from "../components/user-panel.js"
import {ProfilePanel} from "../components/profile-panel.js"
import {PaywallPanel} from "../components/paywall-panel.js"
import {PrivateVimeo} from "../components/private-vimeo.js"
import {AvatarDisplay} from "../components/avatar-display.js"
import {QuestionsForum} from "../components/questions-forum.js"

import {objectMap} from "../toolbox/object-map.js"
import {mixinCss} from "../toolbox/mixin-css.js"
import {registerComponents} from "../toolbox/register-components.js"

import {theme} from "../system/theme.js"
import {provideAuthModel} from "../framework/provide-auth-model.js"
import {Supermodel} from "../interfaces.js"

export function registerComponentsWithModels({
	userModel,
	profileModel,
	paywallModel,
	vimeoModel,
	questionsModel
}: Supermodel) {

	registerComponents(objectMap(
		{
			AvatarDisplay,
			UserPanel: provideAuthModel(userModel, UserPanel),
			ProfilePanel: provideAuthModel(profileModel, ProfilePanel),
			PaywallPanel: provideAuthModel(paywallModel, PaywallPanel),
			PrivateVimeo: provideAuthModel(vimeoModel, PrivateVimeo),
			QuestionsForum: provideAuthModel(questionsModel, QuestionsForum),
		},
		Component => mixinCss(theme, Component)
	))
}
