import prefix from "./cpp/prefix.cpp?raw";
import reservedKeywords from "./cpp/reservedKeywords.txt?raw";

const cpp = {
    getCodePrefix: () => {
        return prefix;
    },

    getReservedKeywords: () => {
        return new Set(reservedKeywords.split("\n"));
    },

    getConvertersPosition: (code) => {
        let includeStartPosition = code.lastIndexOf("#include");
        let includeEndPosition = code.indexOf(">", includeStartPosition);
        let usingNamespaceStartPosition = code.lastIndexOf("using namespace");
        let usingNamespaceEndPosition = code.indexOf(";", usingNamespaceStartPosition);

        let position = Math.max(includeEndPosition, usingNamespaceEndPosition) + 1;
        return position;
    },

    getConverterDeclaration: (code) => {
        return code.slice(0, code.indexOf("{")).trim() + ";";
    },
};
export default cpp;
