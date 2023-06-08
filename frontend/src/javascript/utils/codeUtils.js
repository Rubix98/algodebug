import { useProjectStore } from "@/stores/project";
import { applyChangeOnInterval, areIntervalsIntersectOrTouching, isIntervalEmpty } from "./intervalsUtils";
import lineColumn from "line-column";
import { getLanguage } from "@/javascript/codeParser/languages/languageList";

export function getVariablesArray(languageName, code) {
    const language = getLanguage(languageName);
    const reservedKeywords = language.getReservedKeywords();
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

export function moveBreakpoints(breakpoints, changes) {
    for (let change of changes) {
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

        const store = useProjectStore();
        store.setBreakpoints(newBreakpoints);
    }
}

export function moveTrackedVariables(variables, changes, code) {
    const store = useProjectStore();

    if (changes.length <= 0) return;
    changes[changes.length - 1].last = true;

    variables.forEach((variable) => {
        let variableAfterChanges = variable;
        for (let change of changes) {
            variableAfterChanges = handleVarTrackerMove(variableAfterChanges, change, code);
            if (variableAfterChanges == null) {
                store.deleteVariable(variable.id);
                break;
            }
        }
        if (variableAfterChanges != null) {
            store.updateVariable({ id: variable.id, variable: variableAfterChanges });
        }
    });
}

function handleVarTrackerMove(variable, change, code) {
    let result = { start: variable.start, end: variable.end };
    result = applyChangeOnInterval(result, change);

    if (isIntervalEmpty(result)) return null;
    if (!change.last) return result;

    if (!areIntervalsIntersectOrTouching(variable, change)) {
        expandLeft(result, code);
        return result;
    }

    let potentialName = code.substring(result.start, result.end);
    if (!isLegalVariableName(potentialName)) {
        let legalName = findFirstLegalVariableName(potentialName);
        if (legalName == null) return null;

        result.end = result.start + legalName.end;
        result.start = result.start + legalName.start;
    }

    expandRight(result, code);
    expandLeft(result, code);

    return !isIntervalEmpty(result) ? result : null;
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
