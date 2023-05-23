import { CompilerMultiTestsRequest, CompilerResponse } from "./types";
import { Code } from "./structures/Code";
import { getCompiler } from "./compilers/compilerFactory";

export async function sendRequestsToCompilerAPI(request: CompilerMultiTestsRequest): Promise<CompilerResponse[]> {
    let results: CompilerResponse[] = [];
    const compiler = getCompiler();
    for (const input of request.inputs) {
        const result = await compiler.compile({
            code: request.code,
            input: input,
            language: request.language,
        });
        results.push(result);
        if (!result.success) return results;
    }
    return results;
}

type validCodeOrError = [true, Code] | [false, unknown];

export const sanitizeCode = (c: Code) => {
    return {
        code: c.code,
        language: c.language,
        inputs: c.inputs,
    } as Code;
};

export const validateCode = (req: unknown): validCodeOrError => {
    try {
        return [true, Code.check(req)];
    } catch (error) {
        return [false, error];
    }
};
