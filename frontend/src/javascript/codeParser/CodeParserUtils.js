const variableTagName = "algodebug-variable";
const breakpointTagName = "algodebug-breakpoint";

export class CodeParserUtils {
    static insertVariableTags(code, variables) {
        for (let variable of variables.sortedBy("start", -1)) {
            code =
                code.slice(0, variable.start) +
                this.encloseInTag(variable.id, variableTagName) +
                code.slice(variable.end);
        }
        return code;
    }

    static insertBreakpointTags(code, breakpoints) {
        let lines = code.split("\n");
        for (let breakpoint of breakpoints.sortedBy("id", -1)) {
            lines[breakpoint.id] += this.encloseInTag(breakpoint.id, breakpointTagName);
        }
        code = lines.join("\n");
        return code;
    }

    static removeVariableTags(code) {
        code = this.removeTagsAndMapContent(code, variableTagName, (content) => {
            return content.split("@")[0];
        });
        return code;
    }

    static replaceBreakpointTags(code, parsedBreakpoints) {
        for (let breakpoint of parsedBreakpoints) {
            let variables = breakpoint.variables
                .map((variable) => `ALGODEBUG_VARIABLE(${variable.name}, ${variable.id.split("@")[1]})`)
                .join(" << ");
            code = code.replace(
                this.encloseInTag(breakpoint.line, breakpointTagName),
                variables.length !== 0
                    ? ` ALGODEBUG_BREAKPOINT(${breakpoint.line}, ${variables});`
                    : ` ALGODEBUG_EMPTY_BREAKPOINT(${breakpoint.line});`
            );
        }
        return code;
    }

    static insertAlgodebugMacros(code) {
        return (
            `#define ALGODEBUG_VARIABLE(x, y) "<algodebug-variable " << "name=\\"" << #x << "@" << y << "\\">\\n" << x << "\\n</algodebug-variable>\\n"\n` +
            `#define ALGODEBUG_BREAKPOINT(line, x) std::cout << "<algodebug-breakpoint " << "line=\\"" << line << "\\">\\n" << x << "</algodebug-breakpoint>\\n"\n` +
            `#define ALGODEBUG_EMPTY_BREAKPOINT(line) std::cout << "<algodebug-breakpoint " << "line=\\"" << line << "\\">\\n</algodebug-breakpoint>\\n"\n\n` +
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

    static insertNecessaryIncludes(code) {
        const regex = /#include[ \t]*<iostream>/g;
        if (!regex.test(code)) {
            return "#include <iostream>\n" + code;
        }
        return code;
    }

    static removeTagsAndMapContent(code, tag, mappingFunction) {
        let i = 0;
        while ((i = code.indexOf(`<${tag}>`)) > 0) {
            let start = i + `<${tag}>`.length;
            let end = code.indexOf(`</${tag}>`, start);
            let content = code.substring(start, end);
            code = code.substring(0, i) + mappingFunction(content) + code.substring(end + `</${tag}>`.length);
        }
        return code;
    }

    static encloseInTag(content, tag) {
        return `<${tag}>${content}</${tag}>`;
    }
}
