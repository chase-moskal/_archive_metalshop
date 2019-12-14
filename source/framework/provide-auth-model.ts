
import {AuthModel} from "../interfaces.js"
import {AuthComponent} from "./mixin-auth.js"

export function provideAuthModel<
	C extends new(...args: any[]) => AuthComponent,
	M extends AuthModel = AuthModel
>(model: M, Constructor: C): C {

	return class extends Constructor {
		static model = model
	}
}
