import { CompilerRequest, CompilerResponse } from "../../types/compiler";
import { OutputParser } from "../../utils/OutputParser";
import { Compiler } from "./compilerFactory";

// https://www.jdoodle.com/compiler-api/
export class JDoodleCompilerImpl implements Compiler {
    static API_URL: string = "https://api.jdoodle.com/v1/execute";

    async compile(request: CompilerRequest): Promise<CompilerResponse> {
        const apiResponse = await fetch(JDoodleCompilerImpl.API_URL, {
            method: "POST",
            body: JSON.stringify({
                script: request.code,
                stdin: request.input,
                language: "cpp17",
                clientId: process.env.COMPILER_CLIENT_ID,
                clientSecret: process.env.COMPILER_CLIENT_SECRET,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const response: JDoodleAPIResponse = await apiResponse.json();

        if (response.statusCode === 200) {
            return {
                success: true,
                output: new OutputParser(response.output).parse(),
                errorMessage: null,
            };
        } else {
            return {
                success: false,
                output: null,
                errorMessage: response.error,
            };
        }
    }
}

type JDoodleAPIResponse = {
    statusCode: 200;
    output: string;
    memory: number;
    cpuTime: number;
    error: string;
};
