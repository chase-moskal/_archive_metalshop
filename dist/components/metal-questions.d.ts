import { QuestionsShare } from "../interfaces.js";
import { MetalshopComponent, PropertyValues } from "../framework/metalshop-component.js";
export declare class MetalQuestions extends MetalshopComponent<QuestionsShare> {
    private lastBoard;
    ["board"]: string;
    draftText: string;
    adminMode: boolean;
    minCharacterLimit: number;
    maxCharacterLimit: number;
    private load;
    firstUpdated(props: any): void;
    updated(changedProperties: PropertyValues): void;
    render(): import("lit-html/lib/template-result").TemplateResult;
    private downloadQuestions;
    private getQuestionDraft;
    private handleTextAreaChange;
    private warnUnauthenticatedUser;
    private handlePostClick;
    private prepareHandleDeleteClick;
    private prepareHandleLikeClick;
    private validatePost;
    private handlePurgeClick;
}
