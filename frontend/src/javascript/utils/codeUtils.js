import store from "@/store";
import { applyChangeOnInterval, areIntervalsIntersectOrTouching } from "./intervalsUtils";
import lineColumn from "line-column";
import { reservedKeywords as cppReservedKeywords } from "@/javascript/languages/cpp";

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

export function moveTrackedVariables(project, change) {
    store.dispatch("project/removeOutdatedVariables", (sceneObj) => {
        let wasAnyVariableRenamed = false;

        let result = handleVarTrackerMove(change, sceneObj.variable, project);
        if (result == "Delete") {
            sceneObj.variable = null;
        } else if (result == "Rename") {
            wasAnyVariableRenamed = true;
        }

        for (let subobj of sceneObj.subobjects) {
            result = handleVarTrackerMove(change, subobj.variable, project);
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

    let affectedBreakpoints = [];
    for (let bp of project.breakpoints) {
        if (bp[0] < firstChangedLine) continue;
        if (bp[0] > firstChangedLine && bp[0] < firstChangedLine - change.deltaLineCount) {
            store.dispatch("project/deleteBreakpoint", bp[0]);
        } else if (bp[0] > firstChangedLine) {
            affectedBreakpoints.push(bp[0]);
        }
    }
    affectedBreakpoints.sort((a, b) => {
        return change.deltaLineCount < 0 ? a - b : b - a;
    });

    for (let affectedBreakpoint of affectedBreakpoints) {
        store.dispatch("project/deleteBreakpoint", affectedBreakpoint);
        store.dispatch("project/addBreakpoint", affectedBreakpoint + change.deltaLineCount);
    }
}

function handleVarTrackerMove(change, varObj, project) {
    if (varObj == null) return;

    let originalPos = { start: varObj.start, end: varObj.end };

    let newVarRange = applyChangeOnInterval(varObj.start, varObj.end, change);
    if (newVarRange.end - newVarRange.start <= 0) return "Delete";
    varObj.start = newVarRange.start;
    varObj.end = newVarRange.end;

    if (!areIntervalsIntersectOrTouching(originalPos.start, originalPos.end, change.start, change.end)) {
        expandLeft(varObj, project);
        return;
    }

    let potentialName = project.code.substring(varObj.start, varObj.end);
    if (!isLegalVariableName(potentialName)) {
        let legalName = findFirstLegalVariableName(potentialName);
        if (legalName == null) return "Delete";
        varObj.end = varObj.start + legalName.end;
        varObj.start += legalName.start;
    }

    expandRight(varObj, project);
    expandLeft(varObj, project);

    if (varObj.end - varObj.start <= 0) return "Delete";
    return "Rename";
}

function expandLeft(varObj, project) {
    let i = varObj.start - 1;
    while (i >= 0 && isLegalVariableCharacter(project.code[i])) i--;
    i++;
    while (i <= varObj.end && isDigit(project.code[i])) i++;
    varObj.start = i;
}

function expandRight(varObj, project) {
    let i = varObj.end;
    while (i < project.code.length && isLegalVariableCharacter(project.code[i])) i++;
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
    let code = char.charCodeAt(0);
    return (code > 47 && code < 58) || (code > 64 && code < 91) || (code > 96 && code < 123) || code == 95;
}

function isDigit(char) {
    return char >= "0" && char <= "9";
}
