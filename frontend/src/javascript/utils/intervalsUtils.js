export function areIntervalsIntersectOrTouching(intervalA, intervalB) {
    return intervalA.end >= intervalB.start && intervalA.start <= intervalB.end;
}

export function applyChangeOnInterval(intervalA, change) {
    let result = { start: intervalA.start, end: intervalA.end };

    if (change.end <= intervalA.start) {
        result.start += change.size;
        result.end += change.size;
        return result;
    }

    if (change.start >= intervalA.end) {
        return result;
    }

    if (change.text.length > 0 && intervalA.start == change.start && intervalA.end == change.end) {
        result.start = intervalA.start;
        result.end = intervalA.start + change.text.length;
        return result;
    }

    if (isSubinterval(change, intervalA)) {
        result.start = change.start;
        result.end = change.start;
        return result;
    }

    if (isSubinterval(intervalA, change)) {
        result.end += change.size;
        return result;
    }

    if (change.start >= intervalA.start && change.start <= intervalA.end) {
        result.end = change.start;
        return result;
    }

    if (change.end >= intervalA.start && change.end <= intervalA.end) {
        result.start = change.start;
        result.end -= change.size;
        return result;
    }

    console.warn("Unhandled case", intervalA.start, intervalA.end, change);
    return result;
}

export function isSubinterval(mainInterval, subInterval) {
    return subInterval.start >= mainInterval.start && subInterval.end <= mainInterval.end;
}
