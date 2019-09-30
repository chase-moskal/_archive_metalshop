var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "../toolbox/loading.js";
import { sortQuestions } from "./questions/helpers.js";
import { mixinStyles } from "../framework/mixin-styles.js";
import { styles } from "./styles/metal-questions-styles.js";
import { renderQuestion } from "./questions/render-question.js";
import { renderQuestionEditor } from "./questions/render-question-editor.js";
import { MetalshopComponent, property, html } from "../framework/metalshop-component.js";
let MetalQuestions = class MetalQuestions extends MetalshopComponent {
    constructor() {
        super(...arguments);
        this.lastBoard = null;
        this.draftText = "";
        this.adminMode = false;
        this.minCharacterLimit = 10;
        this.maxCharacterLimit = 240;
        this.handleTextAreaChange = (event) => {
            const target = event.target;
            this.draftText = target.value;
        };
        this.warnUnauthenticatedUser = () => {
            const { user } = this.share;
            let warned = false;
            if (!user) {
                alert("you must be logged in to complete that action");
                warned = true;
            }
            return warned;
        };
        this.handlePostClick = async (event) => {
            if (this.warnUnauthenticatedUser())
                return;
            const draft = this.getQuestionDraft();
            try {
                this.load = loading.loading();
                await this.share.uiBureau.postQuestion({ draft });
                this.draftText = "";
                this.load = loading.ready();
            }
            catch (error) {
                this.load = loading.error("error posting question");
                console.error(error);
            }
        };
        this.prepareHandleDeleteClick = (questionId) => async () => {
            if (this.warnUnauthenticatedUser())
                return;
            if (confirm(`Really delete question ${questionId}?`))
                await this.share.uiBureau.deleteQuestion({ questionId });
        };
        this.prepareHandleLikeClick = ({ like, questionId }) => async (event) => {
            if (this.warnUnauthenticatedUser())
                return;
            await this.share.uiBureau.likeQuestion({
                like,
                questionId,
            });
            const active = document.activeElement;
            if (active)
                active.blur();
        };
        this.handlePurgeClick = async () => {
            const { board } = this;
            if (confirm("Really purge ALL questions from the board?"))
                await this.share.uiBureau.purgeQuestions({ board });
        };
    }
    firstUpdated(props) {
        super.firstUpdated(props);
        this.downloadQuestions();
    }
    updated(changedProperties) {
        if (changedProperties.has("board")) {
            this.downloadQuestions();
        }
    }
    render() {
        const { load, board, draftText, handlePostClick, handlePurgeClick, maxCharacterLimit, handleTextAreaChange, prepareHandleLikeClick, prepareHandleDeleteClick, } = this;
        const questions = this.share.fetchCachedQuestions(board);
        const { user, profile } = this.share;
        const me = (user && profile) ? { user, profile } : null;
        const validation = this.validatePost(me);
        const expand = draftText.length > 0;
        return html `
			<iron-loading .load=${load}>

				<metal-is-admin fancy class="coolbuttonarea">
					<button @click=${handlePurgeClick}>Purge all questions</button>
				</metal-is-admin>

				<div class="posting-area">
					<slot name="post">
						<h2>Post your own question</h2>
					</slot>
					${renderQuestionEditor({
            expand,
            draftText,
            author: me,
            validation,
            handlePostClick,
            maxCharacterLimit,
            handleTextAreaChange,
        })}
				</div>

				<div class="questions-area">
					<slot name="rate">
						<h2>Rate questions</h2>
					</slot>
					<ol class="questions">
						${sortQuestions(me, questions).map(question => html `
							<li>
								${renderQuestion({
            me,
            question,
            prepareHandleLikeClick,
            prepareHandleDeleteClick,
        })}
							</li>
						`)}
					</ol>
				</div>
			</iron-loading>
		`;
    }
    async downloadQuestions() {
        try {
            const { uiBureau } = this.share;
            const { board, lastBoard } = this;
            this.load = loading.loading();
            if (!board)
                throw new Error(`questions-board requires attribute [board]`);
            if (board !== lastBoard) {
                this.lastBoard = board;
                await uiBureau.fetchQuestions({ board });
            }
            this.load = loading.ready();
        }
        catch (error) {
            this.load = loading.error("failed to download questions");
            console.error(error);
        }
    }
    getQuestionDraft() {
        const { board, draftText: content } = this;
        const time = Date.now();
        const valid = !!content;
        return valid
            ? { time, board, content }
            : null;
    }
    validatePost(author) {
        const { draftText, minCharacterLimit: min, maxCharacterLimit: max } = this;
        const { length } = draftText;
        const tooLittle = length < min;
        const tooBig = length > max;
        const premiumClaim = author?.user?.claims.premium;
        if (!author)
            return {
                postable: false,
                message: "You must be logged in as a premium user to post",
                angry: false,
            };
        if (!premiumClaim)
            return {
                postable: false,
                message: "You must become a premium user to post",
                angry: false,
            };
        if (length <= 0)
            return {
                postable: false,
                message: "Nothing to post",
                angry: false,
            };
        if (tooLittle)
            return {
                postable: false,
                message: `${min - length} more characters needed...`,
                angry: true,
            };
        if (tooBig)
            return {
                postable: false,
                message: `${max - length} characters too many`,
                angry: true,
            };
        return {
            postable: true,
            message: null,
            angry: false,
        };
    }
};
__decorate([
    property({ type: String, reflect: true })
], MetalQuestions.prototype, "board", void 0);
__decorate([
    property({ type: String })
], MetalQuestions.prototype, "draftText", void 0);
__decorate([
    property({ type: Boolean })
], MetalQuestions.prototype, "adminMode", void 0);
__decorate([
    property({ type: Number })
], MetalQuestions.prototype, "minCharacterLimit", void 0);
__decorate([
    property({ type: Number })
], MetalQuestions.prototype, "maxCharacterLimit", void 0);
__decorate([
    property({ type: Object })
], MetalQuestions.prototype, "load", void 0);
MetalQuestions = __decorate([
    mixinStyles(styles)
], MetalQuestions);
export { MetalQuestions };
//# sourceMappingURL=metal-questions.js.map