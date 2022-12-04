export type CompilerMultiTestsRequest = {
    code: string;
    inputs: string[];
    language: string;
};

export type CompilerRequest = {
    code: string;
    input: string;
    language: string;
};

//prettier-ignore
export type CompilerResponse = {
    success: true;
    errorMessage: null;
    output: CodeOutput;
} | {
    success: false;
    errorMessage: string;
    output: null;
}

export type CodeOutput = {
    fullOutput: string;
    partialOutputs: string[];
    frames: CodeBreakpoint[];
};

export type CodeBreakpoint = {
    id: number;
    line: number;
    variables: Record<string, string>;
};
