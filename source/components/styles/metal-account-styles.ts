
import {css} from "lit-element"
export const styles = css`

:host {
	display: block;
}

.wedge {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.login {
	justify-content: var(--metal-account-login-justify, center);
}

.logout {
	justify-content: var(--metal-account-logout-justify, flex-end);
}

* + div {
	margin-top: var(--metal-account-margins, 0.4rem);
}

::slotted(*) {
	margin-top: var(--metal-account-margins, 0.4rem) !important;
}

::slotted(*:first-child) {
	margin-top: unset !important;
}

`
