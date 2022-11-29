import {
    CodeBreakpoint,
    CodexApiResponse,
    CompilationResult,
    CompilationResultDetail,
} from "../types/compiler";

const BREAKPOINT_BEGIN_TAG = "<algodebug-breakpoint";
const BREAKPOINT_END_TAG = "</algodebug-breakpoint>\n";

const VARIABLE_BEGIN_TAG = "<algodebug-variable";
const VARIABLE_END_TAG = "</algodebug-variable>\n";

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
                output: {
                    fullOutput: out.output,
                    partialOutputs: [],
                    frames: [],
                },
            };

            // parse output
            let breakpointStart = out.output.indexOf(BREAKPOINT_BEGIN_TAG);
            let breakpointEnd = 0;
            let id = 0;

            while (breakpointStart !== -1) {
                detail.output.partialOutputs.push(
                    out.output.substring(breakpointEnd, breakpointStart)
                );

                breakpointEnd =
                    out.output.indexOf(BREAKPOINT_END_TAG, breakpointStart) +
                    BREAKPOINT_END_TAG.length;

                // extract the line number and variables from the breakpoint
                const breakpoint = parseBreakpoint(
                    out.output.substring(breakpointStart, breakpointEnd),
                    id
                );
                detail.output.frames.push(breakpoint);
                id += 1;

                breakpointStart = out.output.indexOf(
                    BREAKPOINT_BEGIN_TAG,
                    breakpointEnd
                );
            }
            // add the last partial output
            detail.output.partialOutputs.push(
                out.output.substring(breakpointEnd)
            );

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

const parseBreakpoint = (output: string, id: number): CodeBreakpoint => {
    // extract the line number
    const lineStart = output.indexOf("line=") + 6;
    const lineEnd = output.indexOf('"', lineStart);
    const line = parseInt(output.substring(lineStart, lineEnd));

    // extract the variables
    let variables: Record<string, string> = {};

    let variableStart = output.indexOf(VARIABLE_BEGIN_TAG);
    let variableEnd = 0;

    while (variableStart !== -1) {
        variableEnd =
            output.indexOf(VARIABLE_END_TAG, variableStart) +
            VARIABLE_END_TAG.length;

        const variableTag = output.substring(variableStart, variableEnd);
        const [name, value] = parseVariable(variableTag);
        variables[name] = value;

        variableStart = output.indexOf(VARIABLE_BEGIN_TAG, variableEnd);
    }
    return { id, line: line, variables: variables };
};

const parseVariable = (output: string): [string, string] => {
    const variableNameStart = output.indexOf("name=") + 6;
    const variableNameEnd = output.indexOf('"', variableNameStart);
    const variableName = output.substring(variableNameStart, variableNameEnd);

    const variableValue = output.substring(
        output.indexOf(">") + 1,
        output.indexOf("<", output.indexOf(">"))
    );

    return [variableName, variableValue];
};
