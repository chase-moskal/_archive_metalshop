export function ascertainOwnership(question, me) {
    if (!me || !me.user)
        return { mine: false, authority: false };
    const admin = (me && me.user.claims.admin);
    const mine = me && (me.user.userId === question.author.user.userId);
    return {
        mine,
        authority: admin || mine
    };
}
const sortLikes = (a, b) => {
    const aLikes = a.likeInfo ? a.likeInfo.likes : 0;
    const bLikes = b.likeInfo ? b.likeInfo.likes : 0;
    return aLikes > bLikes ? -1 : 1;
};
export const sortQuestions = (me, questions) => {
    const myUserId = me?.user?.userId;
    const filterMine = (q) => q.author.user.userId === myUserId;
    const filterTheirs = (q) => q.author.user.userId !== myUserId;
    return myUserId
        ? [
            ...questions.filter(filterMine).sort(sortLikes),
            ...questions.filter(filterTheirs).sort(sortLikes),
        ]
        : [...questions].sort(sortLikes);
};
//# sourceMappingURL=helpers.js.map