import store from "@/store";
import { areIntervalsIntersect, isSubinterval } from "./intervalsUtils";

export function compareCode(oldText, newText, event, selection) {
    let lengthDifference = newText.length - oldText.length;
    let lineCountDifference = newText.numberOfLines() - oldText.numberOfLines();

    let result = {
        start: selection.start,
        end: selection.end,
        size: lengthDifference,
        deltaLineCount: lineCountDifference,
    };

    result.firstChangedLine = oldText.substr(0, result.start).numberOfLines();
    result.lastChangedLine = oldText.substr(0, result.end).numberOfLines();

    if (selection.start != selection.end) return result;
    if (lengthDifference >= 0) return result;

    if (!event.inputType.includes("Backward") && !event.inputType.includes("Forward")) {
        console.error("Unhandled input type: ", event.inputType);
        return result;
    }

    if (event.inputType.includes("Backward")) {
        result.start -= Math.abs(lengthDifference);
        result.firstChangedLine = oldText.substr(0, result.start).numberOfLines();
    } else {
        result.end += Math.abs(lengthDifference);
        result.lastChangedLine = oldText.substr(0, result.end).numberOfLines();
    }

    return result;
}

function handleVarTrackerMove(change, varObj) {
    if (varObj == null) return;

    if (areIntervalsIntersect(varObj.start, varObj.end, change.start, change.end)) {
        if (isSubinterval(varObj.start, varObj.end, change.start, change.end)) {
            varObj.end += change.size;
            if (varObj.end - varObj.start <= 0) return "Delete";
            return;
        }
        return "Delete";
    }

    if (change.end <= varObj.start) {
        varObj.start += change.size;
        varObj.end += change.size;
    }
}

export function moveTrackedVariables(change) {
    store.dispatch("project/removeOutdatedVariables", (sceneObj) => {
        if (handleVarTrackerMove(change, sceneObj.variable) == "Delete") {
            sceneObj.variable = null;
        }

        for (let subobj of sceneObj.subobjects) {
            if (handleVarTrackerMove(change, subobj.variable) == "Delete") {
                subobj.variable = null;
            }
        }
    });
}

export function moveBreakpoints(project, change) {
    if (change.deltaLineCount == 0) return;

    let firstChangedLine = change.firstChangedLine;

    let affectedBreakpoints = [];
    for (let bp of project.breakpoints) {
        if (bp[0] < firstChangedLine) continue;
        if (bp[0] > firstChangedLine && bp[0] < firstChangedLine - change.deltaLineCount) {
            store.dispatch("project/deleteBreakpoint", bp[0]);
        } else if (bp[0] > firstChangedLine) {
            affectedBreakpoints.push(bp[0]);
        }
    }

    for (let affectedBreakpoint of affectedBreakpoints) {
        store.dispatch("project/addOrDeleteBreakpoint", affectedBreakpoint);
        store.dispatch("project/addOrDeleteBreakpoint", affectedBreakpoint + change.deltaLineCount);
    }
}
