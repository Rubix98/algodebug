import { CompilerRequest, CompilerResponse } from "../../types/compiler";
import { OutputParser } from "../../utils/OutputParser";
import { Compiler } from "./compilerFactory";

// https://github.com/Jaagrav/CodeX-API
export class CodeXCompilerImpl implements Compiler {
    static API_URL: string = "https://codex-api.herokuapp.com/";

    async compile(request: CompilerRequest): Promise<CompilerResponse> {
        const apiResponse = await fetch(CodeXCompilerImpl.API_URL, {
            method: "POST",
            body: JSON.stringify({
                code: request.code,
                input: request.input,
                language: request.language,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const response: CodexApiResponse = await apiResponse.json();

        if (response.success) {
            return {
                success: true,
                output: new OutputParser(response.output).parse(),
            };
        } else {
            return {
                success: false,
                error: response.error,
            };
        }
    }
}

type CodexApiResponse =
    | {
          success: true;
          output: string;
          language: string;
          timestamp: string;
          version: string;
      }
    | {
          success: false;
          error: string;
          language: string;
          timestamp: string;
          version: string;
      };
