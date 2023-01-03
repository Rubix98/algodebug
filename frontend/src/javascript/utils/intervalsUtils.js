export function applyChangeOnInterval(interval, change) {
    let result = { start: interval.start, end: interval.end };

    let changeRelativePos = {
        start: getRelativePositionToInterval(interval, change.start),
        end: getRelativePositionToInterval(interval, change.end),
    };

    if (changeRelativePos.end == "Before") {
        result.start += change.size;
        result.end += change.size;
        return result;
    }

    if (changeRelativePos.start == "After") {
        return result;
    }

    if (change.text.length > 0 && areIntervalsEqual(interval, change)) {
        result.start = interval.start;
        result.end = interval.start + change.text.length;
        return result;
    }

    if (isSubinterval(change, interval)) {
        result.start = change.start;
        result.end = change.start;
        return result;
    }

    if (isSubinterval(interval, change)) {
        result.end += change.size;
        return result;
    }

    if (changeRelativePos.start == "Inside") {
        result.end = change.start;
        return result;
    }

    if (changeRelativePos.end == "Inside") {
        result.start = change.end + change.size;
        result.end += change.size;
        return result;
    }

    console.warn("Unhandled case", interval.start, interval.end, change);
    return result;
}

export function isSubinterval(mainInterval, subInterval) {
    return subInterval.start >= mainInterval.start && subInterval.end <= mainInterval.end;
}

function getRelativePositionToInterval(interval, pos) {
    if (pos < interval.start) return "Before";
    if (pos <= interval.end) return "Inside";
    return "After";
}

function areIntervalsEqual(intervalA, intervalB) {
    return intervalA.start == intervalB.start && intervalA.end == intervalB.end;
}

export function areIntervalsIntersectOrTouching(intervalA, intervalB) {
    return intervalA.end >= intervalB.start && intervalA.start <= intervalB.end;
}
