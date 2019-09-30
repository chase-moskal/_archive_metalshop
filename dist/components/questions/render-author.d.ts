import { QuestionAuthor, LikeInfo } from "authoritarian/dist/interfaces.js";
export declare function renderAuthor({ time, author, likeInfo, handleLikeClick, handleUnlikeClick, placeholderNickname }: {
    time: number;
    author?: QuestionAuthor;
    handleLikeClick: (event: MouseEvent) => void;
    handleUnlikeClick: (event: MouseEvent) => void;
    likeInfo?: LikeInfo;
    placeholderNickname?: string;
}): import("lit-element").TemplateResult;
