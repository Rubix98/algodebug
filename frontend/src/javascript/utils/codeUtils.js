export function compareCode(oldText, newText, event, selection) {
    let oldLen = oldText.length;
    let newLen = newText.length;
    let lengthDifference = newLen - oldLen;

    let oldLineCount = oldText.numberOfLines();
    let newLineCount = newText.numberOfLines();
    let lineCountDifference = newLineCount - oldLineCount;

    let ret = {
        start: selection.start,
        end: selection.end,
        size: lengthDifference,
        deltaLineCount: lineCountDifference,
    };

    if (selection.start != selection.end) return ret;
    if (lengthDifference >= 0) return ret;

    if (!event.inputType.includes("Backward") && !event.inputType.includes("Forward")) {
        console.error("Unhandled input type: ", event.inputType);
        return ret;
    }

    if (event.inputType.includes("Backward")) {
        ret.start -= Math.abs(lengthDifference);
    } else {
        ret.end += Math.abs(lengthDifference);
    }

    return ret;
}

/*
function findFirstDifferentChar(oldText, newText) {
    let differenceStart = 0;

    for (let i = 0; i < Math.min(newText.length, oldText.length); i++) {
        if (newText[i] == oldText[i]) differenceStart = i + 1;
        else break;
    }

    return differenceStart;
}
*/

export function moveTrackedVariables(project, changes) {
    const handleVarTrackerMove = (ch, varObj) => {
        if (varObj == null) return;

        if (ch.end > varObj.start && ch.start < varObj.end) {
            return "Delete"; //TODO: Allow changing variable name
        }

        if (ch.end <= varObj.start) {
            varObj.start += ch.size;
            varObj.end += ch.size;
        }
    };

    project.sceneObjects = project.sceneObjects.filter((sceneObj) => {
        let mainVar = sceneObj.variable;
        if (handleVarTrackerMove(changes, mainVar) == "Delete") {
            return false;
        }

        for (let subobj of sceneObj.subobjects) {
            if (handleVarTrackerMove(changes, subobj.variable) == "Delete") {
                subobj.variable = null;
            }
        }

        return true;
    });
}

export function moveBreakpoints(project, change) {
    if (change.deltaLineCount == 0) return;

    let firstChangedLine = change.firstChangedLine;

    let affectedBreakpoints = [];
    for (let bp of project.breakpoints) {
        if (bp[0] < firstChangedLine) continue;
        if (bp[0] > firstChangedLine && bp[0] < firstChangedLine - change.deltaLineCount) {
            project.breakpoints.addOrDelete({
                id: bp[0],
            });
        } else if (bp[0] > firstChangedLine) {
            affectedBreakpoints.push(bp[0]);
        }
    }
    for (let affectedBreakpoint of affectedBreakpoints) {
        project.breakpoints.addOrDelete({
            id: affectedBreakpoint,
        });
        project.breakpoints.addOrDelete({
            id: affectedBreakpoint + change.deltaLineCount,
        });
    }
}
