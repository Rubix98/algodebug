import store from "@/store";
import { areIntervalsIntersect, isSubinterval } from "./intervalsUtils";
import lineColumn from "line-column";
import { reservedKeywords as cppReservedKeywords } from "@/javascript/languages/cpp";
import { deepCopy } from "@/javascript/utils/other";

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

function handleVarTrackerMove(variable, change) {
    let result = deepCopy(variable);

    if (isSubinterval(variable.start, variable.end, change.start, change.end)) {
        result.end += change.size;
        return result.end - result.start > 0 ? result : null;
    }
    if (areIntervalsIntersect(variable.start, variable.end, change.start, change.end)) {
        return null;
    }

    if (change.end <= variable.start) {
        result.start += change.size;
        result.end += change.size;
    }

    return result;
}

export function moveTrackedVariables(variables, change) {
    variables.forEach((variable) => {
        let newVariable = handleVarTrackerMove(variable, change);
        if (newVariable == null) {
            store.dispatch("project/deleteVariable", variable.id);
        } else {
            store.dispatch("project/updateVariable", newVariable);
        }
    });
}

export function moveBreakpoints(breakpoints, change) {
    if (change.deltaLineCount == 0) return;

    let firstChangedLine = change.firstChangedLine - 1;
    let lastChangedLine = firstChangedLine - change.deltaLineCount;

    let newBreakpoints = breakpoints.filter(
        (breakpoint) => breakpoint.id <= firstChangedLine || breakpoint.id >= lastChangedLine
    );
    newBreakpoints.forEach((breakpoint) => {
        if (breakpoint.id >= firstChangedLine) {
            breakpoint.id += change.deltaLineCount;
        }
    });

    store.dispatch("project/setBreakpoints", newBreakpoints);
}
