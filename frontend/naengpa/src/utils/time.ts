export const getCurrentTime = () => {
    const today = new Date();
    const hours = today.getHours();

    if (hours >= 7 && hours < 12) {
        return "아침"
    } else if (12 <= hours && hours < 15) {
        return "점심"
    } else if (15 <= hours && hours  < 18) {
        return "오후"
    } else if (18 <= hours && hours  < 21) {
        return "저녁"
    } else if (21 <= hours && hours ) {
        return "밤"
    } else if (hours < 7) {
        return "새벽"
    }
};

export const getCurrentTimeGreet = (name: string) => {
    const today = new Date();
    const hours = today.getHours();

    if (hours >= 7 && hours < 12) {
        return `힘세고 강한 아침, 반갑다 ${name}!`
    } else if (12 <= hours && hours < 15) {
        return `점심 맛있게 드세요, ${name}님!`
    } else if (15 <= hours && hours  < 18) {
        return `나른한 오후네요 ${name}님, 반가워요!`
    } else if (18 <= hours && hours  < 21) {
        return `벌써 저녁시간이에요 ${name}님! 식사는 하셨나요?`
    } else if (21 <= hours && hours ) {
        return `밝은 달이 뜬 밤이에요 ${name}님. 반가워요!`
    } else if (hours < 7) {
        return `별이 빛나는 새벽이에요 ${name}님. 반가워요!`
    }
};
