const upperCaseFirstLetter = (text) => {
    return text[0].toUpperCase() + text.slice(1);
}

function getHourFromMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if(h === 0 && n === 0) return '0';
    else return `${h}:${m}`;
}

function getMinutesFromHours(hours) {
    const h = parseInt(hours.split(':')[0]);
    const m = parseInt(hours.split(':')[1])
    const total = (h * 60) + m;

    return total;
}

module.exports = {
    upperCaseFirstLetter,
    getHourFromMinutes,
    getMinutesFromHours
}