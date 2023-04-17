import { CodeParserUtils } from "./CodeParserUtils";

export class CodeParser {
    actions = {
        "<algodebug-variable>": function (parent, tag) {
            let beginIndex = tag.position + tag.key.length;
            let endIndex = parent.code.indexOf("</algodebug-variable>", beginIndex);
            let variableID = parent.code.slice(beginIndex, endIndex);
            let variableName = variableID.split("@")[0];
            let variableLevel = parent.curlyBracketsLevel + (parent.roundBracketsLevel ? 1 : 0);
            let variableType = parent.variables.findById(variableID).type;
            parent.stack.push({ id: variableID, name: variableName, level: variableLevel, type: variableType });
        },
        "<algodebug-breakpoint>": function (parent, tag) {
            let beginIndex = tag.position + tag.key.length;
            let endIndex = parent.code.indexOf("</algodebug-breakpoint>", beginIndex);
            let line = parent.code.slice(beginIndex, endIndex);
            parent.parsedBreakpoints.push({ line: line, variables: [...parent.stack] });
        },
        "{": function (parent) {
            parent.curlyBracketsLevel++;
        },
        "}": function (parent) {
            parent.stack = parent.stack.filter((variable) => variable.level < parent.curlyBracketsLevel);
            parent.curlyBracketsLevel--;
        },
        "(": function (parent) {
            parent.roundBracketsLevel++;
        },
        ")": function (parent) {
            parent.roundBracketsLevel--;
        },
    };

    constructor(code, sceneObjectsFlat, variables, breakpoints, converters) {
        this.code = code;
        this.sceneObjectsFlat = sceneObjectsFlat;
        this.variables = variables;
        this.breakpoints = breakpoints;
        this.converters = converters;

        this.parsedBreakpoints = [];
        this.stack = [];
        this.roundBracketsLevel = 0;
        this.curlyBracketsLevel = 0;
    }

    parse() {
        console.log(this.sceneObjectsFlat);
        this.prepareCode();

        let tags = this.findAllPositionsOfEveryTag();
        tags = this.filterNonCodeTags(tags);
        for (let tag of tags) {
            this.actions[tag.key](this, tag);
        }

        this.parseCode();
        return this.code;
    }

    findAllPositionsOfEveryTag() {
        let result = [];
        for (let actionKey in this.actions) {
            result = result.concat(
                this.code.findAllOccurences(actionKey).map((o) => {
                    return { key: actionKey, position: o };
                })
            );
        }
        return result.sortedBy("position");
    }

    findAllNonCodeIntervals() {
        let result = [];
        let currentSituation = null;
        for (let i = 0; i < this.code.length - 1; i++) {
            if (currentSituation == null) {
                if (this.code[i] == '"' || this.code[i] == "'") {
                    currentSituation = this.code[i];
                } else if (this.code[i] == "/" && this.code[i + 1] == "/") {
                    currentSituation = "//";
                } else if (this.code[i] == "/" && this.code[i + 1] == "*") {
                    currentSituation = "/*";
                }
                if (currentSituation != null) result.push({ start: i, end: null });
                continue;
            }

            if (currentSituation == '"' || currentSituation == "'") {
                if (this.code[i] == "\\") i++;
                else if (this.code[i] == currentSituation) currentSituation = null;
            } else if (currentSituation == "//") {
                if (this.code[i] == "\n") currentSituation = null;
            } else if (currentSituation == "/*") {
                if (this.code[i] == "*" && this.code[i + 1] == "/") currentSituation = null;
            }

            if (currentSituation == null) {
                result[result.length - 1].end = i;
            }
        }
        return result;
    }

    filterNonCodeTags(tags) {
        const intervals = this.findAllNonCodeIntervals();
        return tags.filter((tag) => {
            return (
                intervals.find((interval) => {
                    return interval.start <= tag.position && interval.end >= tag.position;
                }) == undefined
            );
        });
    }

    prepareCode() {
        this.code = CodeParserUtils.insertVariableTags(this.code, this.variables);
        this.code = CodeParserUtils.insertBreakpointTags(this.code, this.breakpoints);
    }

    parseCode() {
        this.code = CodeParserUtils.removeVariableTags(this.code);
        this.code = CodeParserUtils.replaceBreakpointTags(this.code, this.sceneObjectsFlat, this.parsedBreakpoints);
        this.code = CodeParserUtils.insertConvertersAfterIncludes(this.code, this.converters);
        this.code = CodeParserUtils.insertConvertersAtTheEnd(this.code, this.converters);
        this.code = CodeParserUtils.insertAlgodebugMacros(this.code);
        this.code = CodeParserUtils.insertNecessaryIncludes(this.code);
    }
}
