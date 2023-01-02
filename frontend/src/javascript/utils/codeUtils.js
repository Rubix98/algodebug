import store from "@/store";
import { areIntervalsIntersect, isSubinterval } from "./intervalsUtils";
import lineColumn from "line-column";
import { reservedKeywords as cppReservedKeywords } from "@/javascript/languages/cpp";

function getReservedKeywords(language = "cpp") {
    if (language == "cpp") return cppReservedKeywords;
    return [];
}

export function getVariablesArray(language, code) {
    const reservedKeywords = getReservedKeywords(language);
    let variables = code.getWordsArray();
    variables = variables.filter((word) => !reservedKeywords.has(word));
    variables = variables.filter((word) => word[0] < "0" || word[0] > "9");

    let codeIndex = 0;
    variables = variables.map((variable) => {
        let result = {
            name: variable,
            start: code.indexOf(variable, codeIndex),
        };
        result.end = result.start + variable.length;

        let startLineColumn = lineColumn(code, result.start);
        let endLineColumn = lineColumn(code, result.end);

        result.startLineNumber = startLineColumn.line;
        result.startColumn = startLineColumn.col;
        result.endLineNumber = endLineColumn.line;
        result.endColumn = endLineColumn.col;

        codeIndex = result.end;

        return result;
    });

    // TODO: Wiecej sposobow wykrywania, czy cos jest zmienna
    // (np. spojrzec na nastepny niebialy znak, jesli jest otwierajacym nawiasem
    // to element jest funkcja a nie zmienna)

    return variables;
}

export function monacoChangeToLegacyFormat(code, change) {
    let result = {
        start: change.rangeOffset,
        end: change.rangeOffset + change.rangeLength,
        size: -change.rangeLength,
        firstChangedLine: change.range.startLineNumber,
    };
    let removedText = code.substring(result.start, result.end);
    result.deltaLineCount = -(removedText.match(/[\n]/g) ?? []).length;

    if (change.text.length > 0) {
        result.size += change.text.length;
        result.deltaLineCount += (change.text.match(/[\n]/g) ?? []).length;
    }
    return result;
}

function handleVarTrackerMove(change, varObj) {
    if (varObj == null) return;

    if (areIntervalsIntersect(varObj.start, varObj.end, change.start, change.end)) {
        if (isSubinterval(varObj.start, varObj.end, change.start, change.end)) {
            varObj.end += change.size;
            if (varObj.end - varObj.start <= 0) return "Delete";
            return "Rename";
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
        let wasAnyVariableRenamed = false;

        let result = handleVarTrackerMove(change, sceneObj.variable);
        if (result == "Delete") {
            sceneObj.variable = null;
        } else if (result == "Rename") {
            wasAnyVariableRenamed = true;
        }

        for (let subobj of sceneObj.subobjects) {
            result = handleVarTrackerMove(change, subobj.variable);
            if (result == "Delete") {
                subobj.variable = null;
            } else if (result == "Rename") {
                wasAnyVariableRenamed = true;
            }
        }

        if (wasAnyVariableRenamed) {
            store.dispatch("project/renameVariables", sceneObj);
        }
    });
}

export function moveBreakpoints(project, change) {
    if (change.deltaLineCount == 0) return;

    let firstChangedLine = change.firstChangedLine - 1;
    let lastChangedLine = firstChangedLine - change.deltaLineCount;

    let breakpoints = project.breakpoints.filter(
        (breakpoint) => breakpoint.id <= firstChangedLine || breakpoint.id >= lastChangedLine
    );
    breakpoints.forEach((breakpoint) => {
        if (breakpoint.id >= firstChangedLine) {
            breakpoint.id += change.deltaLineCount;
        }
    });

    store.dispatch("project/setBreakpoints", breakpoints);
}
