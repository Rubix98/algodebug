import { CompilerRequest, CompilerResponse } from "../types";
import { OutputParser } from "../utils/OutputParser";
import { Compiler } from "./compilerFactory";

export class AlgoDebugCompilerImpl implements Compiler {
    static API_URL: string = "https://compiler.algodebug.pl/compile";

    async compile(request: CompilerRequest): Promise<CompilerResponse> {
        const url = process.env.COMPILER_API_URL ?? AlgoDebugCompilerImpl.API_URL;

        const apiResponse = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                code: request.code,
                input: request.input,
                language: request.language,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const response: AlgoDebugCompilerApiResponse = await apiResponse.json();
        if (response.success) {
            return {
                success: true,
                output: new OutputParser(response.output).parse(),
                error: response.error,
            };
        } else {
            return {
                success: false,
                error: response.error,
            };
        }
    }
}

//prettier-ignore
type AlgoDebugCompilerApiResponse = {
    success: true;
    output: string;
    error: string;
} | {
    success: false;
    error: string;
};
