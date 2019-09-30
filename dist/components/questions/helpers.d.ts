import { Question, QuestionAuthor } from "authoritarian/dist/interfaces.js";
export declare function ascertainOwnership(question: Question, me: QuestionAuthor): {
    mine: boolean;
    authority: boolean;
};
export declare const sortQuestions: (me: QuestionAuthor, questions: Question[]) => Question[];
