export function areIntervalsIntersectOrTouching(aStart, aEnd, bStart, bEnd) {
    return aEnd >= bStart && aStart <= bEnd;
}

export function applyChangeOnInterval(aStart, aEnd, change) {
    let result = { start: aStart, end: aEnd };

    if (change.end <= aStart) {
        result.start += change.size;
        result.end += change.size;
        return result;
    }

    if (change.start >= aEnd) {
        return result;
    }

    if (change.text.length > 0 && aStart == change.start && aEnd == change.end) {
        result.start = aStart;
        result.end = aStart + change.text.length;
        return result;
    }

    if (isSubinterval(change.start, change.end, aStart, aEnd)) {
        result.start = change.start;
        result.end = change.start;
        return result;
    }

    if (isSubinterval(aStart, aEnd, change.start, change.end)) {
        result.end += change.size;
        return result;
    }

    if (change.start >= aStart && change.start <= aEnd) {
        result.end = change.start;
        return result;
    }

    if (change.end >= aStart && change.end <= aEnd) {
        result.start = change.start;
        result.end -= change.size;
        return result;
    }

    console.warn("Unhandled case", aStart, aEnd, change);
    return result;
}

export function isSubinterval(mainStart, mainEnd, subStart, subEnd) {
    return subStart >= mainStart && subEnd <= mainEnd;
}
