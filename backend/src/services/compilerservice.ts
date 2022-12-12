import { CompilerResponse } from "../types/compiler";
import { getCompiler } from "./compilers/compilerFactory";
import { CompilerMultiTestsRequest } from "../models/CompilerMultiTestsRequest";

export const sendRequestsToCompilerAPI = async (request: CompilerMultiTestsRequest): Promise<CompilerResponse[]> => {
    let results: CompilerResponse[] = [];
    const compiler = getCompiler();
    for (const input of request.inputs) {
        const result = await compiler.compile({
            code: request.code,
            input: input,
            language: request.language,
        });
        results.push(result);
    }
    return results;
};
