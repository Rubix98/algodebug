import { CodexApiResponse, CompilationResult, CompilationResultDetail } from "../types/compiler";
import { OutputParser } from "../utils/OutputParser";

export const parseOutput = (outputs: CodexApiResponse[]) => {
    let result: CompilationResult = {
        // if any of the outputs is false, the result success is false
        success: outputs.map((o) => o.success).every((s) => s),
        details: [],
    };

    for (const out of outputs) {
        if (out.success) {
            let detail: CompilationResultDetail = {
                success: true,
                errorMessage: null,
                output: new OutputParser(out.output).parse(),
            };

            result.details.push(detail);
        } else {
            let detail: CompilationResultDetail = {
                success: false,
                errorMessage: out.error,
                output: null,
            };
            result.details.push(detail);
        }
    }
    return result;
};
