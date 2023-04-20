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

    static replaceBreakpointTags(code, sceneObjectsFlat, parsedBreakpoints) {
        for (let breakpoint of parsedBreakpoints) {
            let breakpointText = `ALGODEBUG_BREAKPOINT_START(${breakpoint.line}); `;
            for (let sceneObject of sceneObjectsFlat) {
                const isEveryVariableAvailable = sceneObject.variables.every((v1) =>
                    breakpoint.variables.find((v2) => v1.id == v2.id)
                );
                if (!isEveryVariableAvailable) continue;

                let converterName = sceneObject.converter ? `algodebug_converter_${sceneObject.converter._id}` : "";
                let variables = sceneObject.variables.map((v) => v.name).join(", ");
                let converterText = `${converterName}(${variables})`;

                breakpointText += `ALGODEBUG_OBJECT(${sceneObject.id}, ${converterText}); `;
            }
            breakpointText += "ALGODEBUG_BREAKPOINT_END();";

            code = code.replace(this.encloseInTag(breakpoint.line, breakpointTagName), breakpointText);
        }
        return code;
    }

    static insertAlgodebugMacros(code) {
        return (
            `#define ALGODEBUG_OBJECT(id, x) std::cout << "<algodebug-object " << "id=\\"" << #id << "\\">\\n"; std::cout << x; std::cout << "\\n</algodebug-object>\\n"\n` +
            `#define ALGODEBUG_BREAKPOINT_START(line) std::cout << "<algodebug-breakpoint " << "line=\\"" << line << "\\">\\n"\n` +
            `#define ALGODEBUG_BREAKPOINT_END() std::cout << "</algodebug-breakpoint>\\n"\n\n` +
            code
        );
    }

    static insertConvertersAfterIncludes(code, converters) {
        converters = converters
            .map((converter) => {
                let code = this.getRenamedConverterCode(converter);
                return code.slice(0, code.indexOf("{")).trim() + ";";
            })
            .join("\n");

        converters += "\n" + this.getDefaultConverters();

        let includeStartPosition = code.lastIndexOf("#include");
        let includeEndPosition = code.indexOf(">", includeStartPosition);
        let usingNamespaceStartPosition = code.lastIndexOf("using namespace");
        let usingNamespaceEndPosition = code.indexOf(";", usingNamespaceStartPosition);

        let position = Math.max(includeEndPosition, usingNamespaceEndPosition) + 1;
        code = code.slice(0, position) + "\n\n" + converters + code.slice(position);
        return code;
    }

    static insertConvertersAtTheEnd(code, converters) {
        converters = converters.map((converter) => this.getRenamedConverterCode(converter)).join("\n\n");
        return code + "\n\n" + converters;
    }

    static insertNecessaryIncludes(code) {
        let regex = /#include[ \t]*<iostream>/g;
        if (!regex.test(code)) {
            code = "#include <iostream>\n" + code;
        }

        regex = /#include[ \t]*<vector>/g;
        if (!regex.test(code)) {
            code = "#include <vector>\n" + code;
        }

        regex = /#include[ \t]*<tuple>/g;
        if (!regex.test(code)) {
            code = "#include <tuple>\n" + code;
        }
        return code;
    }

    static getRenamedConverterCode(converter) {
        let newConverterName = `algodebug_converter_${converter._id}`;
        return converter.code.replace("convert", newConverterName);
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

    static getDefaultConverters() {
        return (
            "template <class A, class B>\n" +
            "std::ostream& operator<<(std::ostream& os, const std::pair<A,B>& p)\n" +
            "{\n" +
            '\tos << p.first << " " << p.second << "\\n";\n' +
            "\treturn os;\n" +
            "}\n" +
            "template <class A, class B, class C>\n" +
            "std::ostream& operator<<(std::ostream& os, const std::tuple<A,B,C>& t)\n" +
            "{\n" +
            '\tos << std::get<0>(t) << " " << std::get<1>(t) << " " << std::get<2>(t) << "\\n";\n' +
            "\treturn os;\n" +
            "}\n" +
            "template <class A>\n" +
            "std::ostream& operator<<(std::ostream& os, const std::vector<A>& v)\n" +
            "{\n" +
            '\tfor(auto e : v) os << e << "\\n";\n' +
            "\treturn os;\n" +
            "}"
        );
    }
}
