import { Question, QuestionAuthor } from "authoritarian/dist/interfaces.js";
import { PrepareHandleLikeClick } from "../../interfaces.js";
export declare function renderQuestion({ me, question, prepareHandleLikeClick, prepareHandleDeleteClick, }: {
    me: QuestionAuthor;
    question: Question;
    prepareHandleLikeClick: PrepareHandleLikeClick;
    prepareHandleDeleteClick: (questionId: string) => (event: MouseEvent) => void;
}): import("lit-element").TemplateResult;
