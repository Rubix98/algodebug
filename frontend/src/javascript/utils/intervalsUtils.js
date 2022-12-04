export function areIntervalsIntersect(aStart, aEnd, bStart, bEnd) {
    return aEnd > bStart && aStart < bEnd;
}

export function isSubinterval(mainStart, mainEnd, subStart, subEnd) {
    return subStart >= mainStart && subEnd <= mainEnd;
}
