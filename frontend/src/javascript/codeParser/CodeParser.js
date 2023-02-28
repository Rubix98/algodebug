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

    constructor(code, variables, breakpoints, converters) {
        this.code = code;
        this.variables = variables;
        this.breakpoints = breakpoints;
        this.converters = converters;

        this.parsedBreakpoints = [];
        this.stack = [];
        this.roundBracketsLevel = 0;
        this.curlyBracketsLevel = 0;
    }

    parse() {
        this.prepareCode();
        this.initializeTags();

        while (this.findNextTag()) {
            let tag = this.findNextTag();
            tag.action(this, tag);
            this.updateTagPosition(tag);
        }

        this.parseCode();
        return this.code;
    }

    initializeTags() {
        this.tags = [];
        for (let actionKey in this.actions) {
            this.tags.push({
                id: this.tags.length,
                key: actionKey,
                position: 0,
                action: this.actions[actionKey],
            });
        }
        this.updateAllTagsPosition();
    }

    updateAllTagsPosition() {
        for (let tag of this.tags) {
            this.updateTagPosition(tag);
        }
    }

    updateTagPosition(tag) {
        let position = this.code.indexOf(tag.key, tag.position + 1);
        position = position !== -1 ? position : this.inf;
        this.tags[tag.id].position = position;
    }

    findNextTag() {
        let result = null;
        for (let tag of this.tags) {
            if (tag.position !== this.inf && (result == null || tag.position < result.position)) {
                result = tag;
            }
        }
        return result;
    }

    prepareCode() {
        this.code = CodeParserUtils.insertVariableTags(this.code, this.variables);
        this.code = CodeParserUtils.insertBreakpointTags(this.code, this.breakpoints);
    }

    parseCode() {
        this.code = CodeParserUtils.removeVariableTags(this.code);
        this.code = CodeParserUtils.replaceBreakpointTags(this.code, this.parsedBreakpoints);
        this.code = CodeParserUtils.insertConvertersAfterIncludes(this.code, this.converters);
        this.code = CodeParserUtils.insertConvertersAtTheEnd(this.code, this.converters);
        this.code = CodeParserUtils.insertAlgodebugMacros(this.code);
        this.code = CodeParserUtils.insertNecessaryIncludes(this.code);
    }
}
