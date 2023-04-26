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
    output: CodeOutput;
} | {
    success: false;
    error: string;
}

export type CodeOutput = {
    fullOutput: string;
    partialOutputs: string[];
    frames: CodeBreakpoint[];
};

export type CodeBreakpoint = {
    id: number;
    line: number;
    sceneObjects: Record<string, string>;
};
