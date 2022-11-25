export type CodexApiResponse = {
    language: string,
    success: false,
    error: string
    timestamp: string,
    version: string
} | {
    language: string,
    success: true,
    output: string,
    timestamp: string,
    version: string
}

export type CompilationResult = {
    success: boolean,
    details: CompilationResultDetail[]
}

export type CompilationResultDetail = {
    success: true,
    errorMessage: null,
    output: CodeOutput
} | {
    success: false,
    errorMessage: string,
    output: null
}

export type CodeOutput = {
    fullOutput: string
    partialOutputs: string[],
    frames: CodeBreakpoint[]
}

export type CodeBreakpoint = {
    id: number,
    line: number,
    variables: Record<string, string>
}
