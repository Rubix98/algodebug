export class CodeParser {
    actions = {
        "<algodebug-variable>": function (parent, tag) {
            let beginIndex = tag.position + tag.key.length;
            let endIndex = parent.code.indexOf("</algodebug-variable>", beginIndex);
            let variableName = parent.code.slice(beginIndex, endIndex);
            let variableLevel = parent.curlyBracketsLevel + (parent.roundBracketsLevel ? 1 : 0);
            let variableType = parent.variables.findById(variableName).type;
            parent.stack.push({ name: variableName, level: variableLevel, type: variableType });
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
        this.code = CodeUtils.insertVariableTags(this.code, this.variables);
        this.code = CodeUtils.insertBreakpointTags(this.code, this.breakpoints);
    }

    parseCode() {
        this.code = CodeUtils.removeVariableTags(this.code);
        this.code = CodeUtils.replaceBreakpointTags(this.code, this.parsedBreakpoints);
        this.code = CodeUtils.insertConvertersAfterIncludes(this.code, this.converters);
        this.code = CodeUtils.insertConvertersAtTheEnd(this.code, this.converters);
        this.code = CodeUtils.insertAlgodebugMacros(this.code);
    }
}

class CodeUtils {
    static insertVariableTags(code, variables) {
        for (let variable of variables.sortedBy("start", -1)) {
            code =
                code.slice(0, variable.start) +
                "<algodebug-variable>" +
                code.slice(variable.start, variable.end) +
                "</algodebug-variable>" +
                code.slice(variable.end);
        }
        return code;
    }

    static insertBreakpointTags(code, breakpoints) {
        let lines = code.split("\n");
        for (let breakpoint of breakpoints.sortedBy("id", -1)) {
            lines[breakpoint.id] += `<algodebug-breakpoint>${breakpoint.id}</algodebug-breakpoint>`;
        }
        code = lines.join("\n");
        return code;
    }

    static removeVariableTags(code) {
        code = code.replaceAll("<algodebug-variable>", "").replaceAll("</algodebug-variable>", "");
        return code;
    }

    static replaceBreakpointTags(code, parsedBreakpoints) {
        for (let breakpoint of parsedBreakpoints) {
            let variables = breakpoint.variables.map((variable) => `ALGODEBUG_VARIABLE(${variable.name})`).join(" << ");
            code = code.replace(
                `<algodebug-breakpoint>${breakpoint.line}</algodebug-breakpoint>`,
                variables.length !== 0
                    ? ` ALGODEBUG_BREAKPOINT(${breakpoint.line}, ${variables});`
                    : ` ALGODEBUG_EMPTY_BREAKPOINT(${breakpoint.line});`
            );
        }
        return code;
    }

    static insertAlgodebugMacros(code) {
        return (
            `#define ALGODEBUG_VARIABLE(x) "<algodebug-variable " << "name=\\"" << #x << "\\">\\n" << x << "\\n</algodebug-variable>\\n"\n` +
            `#define ALGODEBUG_BREAKPOINT(line, x) cout << "<algodebug-breakpoint " << "line=\\"" << line << "\\">\\n" << x << "</algodebug-breakpoint>\\n"\n` +
            `#define ALGODEBUG_EMPTY_BREAKPOINT(line) cout << "<algodebug-breakpoint " << "line=\\"" << line << "\\">\\n</algodebug-breakpoint>\\n"\n\n` +
            code
        );
    }

    static insertConvertersAfterIncludes(code, converters) {
        converters = converters
            .map((converter) => converter.code.slice(0, converter.code.indexOf("{")).trim() + ";")
            .join("\n");

        let includeStartPosition = code.lastIndexOf("#include");
        let includeEndPosition = code.indexOf(">", includeStartPosition);
        let usingNamespaceStartPosition = code.lastIndexOf("using namespace");
        let usingNamespaceEndPosition = code.indexOf(";", usingNamespaceStartPosition);

        let position = Math.max(includeEndPosition, usingNamespaceEndPosition) + 1;
        code = code.slice(0, position) + "\n\n" + converters + code.slice(position);
        return code;
    }

    static insertConvertersAtTheEnd(code, converters) {
        converters = converters.map((converter) => converter.code).join("\n\n");
        return code + "\n\n" + converters;
    }
}
