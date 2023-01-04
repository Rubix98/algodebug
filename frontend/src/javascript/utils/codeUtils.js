import store from "@/store";
import { applyChangeOnInterval, areIntervalsIntersectOrTouching } from "./intervalsUtils";
import lineColumn from "line-column";
import { reservedKeywords as cppReservedKeywords } from "@/javascript/languages/cpp";
import { deepCopy } from "@/javascript/utils/other";

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
        text: change.text,
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

function handleVarTrackerMove(change, varObj, code) {
    if (varObj == null) return;

    let originalPos = { start: varObj.start, end: varObj.end };

    let newVarRange = applyChangeOnInterval(varObj, change);
    if (newVarRange.end - newVarRange.start <= 0) return "Delete";
    varObj.start = newVarRange.start;
    varObj.end = newVarRange.end;

    if (!areIntervalsIntersectOrTouching(originalPos, change)) {
        expandLeft(varObj, code);
        return;
    }

    let potentialName = code.substring(varObj.start, varObj.end);
    if (!isLegalVariableName(potentialName)) {
        let legalName = findFirstLegalVariableName(potentialName);
        if (legalName == null) return "Delete";

        varObj.end = varObj.start + legalName.end;
        varObj.start += legalName.start;
    }

    expandRight(varObj, code);
    expandLeft(varObj, code);

    if (varObj.end - varObj.start <= 0) return "Delete";
    return "Rename";
}

function expandLeft(varObj, code) {
    let i = varObj.start - 1;
    while (i >= 0 && isLegalVariableCharacter(code[i])) i--;
    i++;
    while (i <= varObj.end && isDigit(code[i])) i++;
    varObj.start = i;
}

function expandRight(varObj, code) {
    let i = varObj.end;
    while (i < code.length && isLegalVariableCharacter(code[i])) i++;
    varObj.end = i;
}

function getReservedKeywords(language = "cpp") {
    if (language == "cpp") return cppReservedKeywords;
    return [];
}

function findFirstLegalVariableName(text) {
    const regex = /[a-zA-Z_][a-zA-Z_0-9]*/g;
    let match = regex.exec(text);
    if (match == null) return null;
    return { start: match.index, end: regex.lastIndex };
}

function isLegalVariableName(text) {
    return /^[a-zA-Z_][a-zA-Z_0-9]*$/.test(text);
}

function isLegalVariableCharacter(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || (char >= "0" && char <= "9") || char == "_";
}

function isDigit(char) {
    return char >= "0" && char <= "9";
}
