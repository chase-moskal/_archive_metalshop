
import {SeekerShare} from "../interfaces.js"
import * as loading from "../toolbox/loading.js"
import {mixinStyles} from "../framework/mixin-styles.js"
import {MetalshopComponent, html, css, TemplateResult} from "../framework/metalshop-component.js"

import {TextChangeEvent} from "../components/iron-text-input.js"

const wrap = (content: TemplateResult) => html`
	<metal-is-loggedin>
		<p slot="not">not logged in</p>
		<metal-is-admin>
			${content}
			<p slot="not">not admin</p>
		</metal-is-admin>
	</metal-is-loggedin>
`

@mixinStyles(css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
`)
export class MetalSeeker extends MetalshopComponent<SeekerShare> {

	private async handleTextChange(event: TextChangeEvent) {
		const {text} = event.detail
		const {query} = this.share
		await query(text)
	}

	render() {
		const {resultsLoad} = this.share
		const results = loading.payload(resultsLoad) || []
		return wrap(html`
			<iron-text-input @textchange=${this.handleTextChange}>
				Search for Users
			</iron-text-input>
			<iron-loading .load=${resultsLoad}>
				${results.map(persona => html`
					<li>
						<cobalt-avatar .persona=${persona}></cobalt-avatar>
						<cobalt-card .persona=${persona}></cobalt-card>
					</li>
				`)}
			</iron-loading>
		`)
	}
}
