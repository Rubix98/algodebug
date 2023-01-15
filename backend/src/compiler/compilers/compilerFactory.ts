import { CompilerRequest, CompilerResponse } from "../types";
import { AlgoDebugCompilerImpl } from "./AlgoDebugCompilerImpl";
import { CodeXCompilerImpl } from "./CodeXCompilerImpl";
import { JDoodleCompilerImpl } from "./JDoodleCompilerImpl";

export enum CompilerTypes {
    ALGODEBUG = "ALGODEBUG",
    CODEX = "CODEX",
    JDOODLE = "JDOODLE",
}

export interface Compiler {
    compile(request: CompilerRequest): Promise<CompilerResponse>;
}

export function getCompiler(): Compiler {
    const compilerMap: Record<CompilerTypes, Compiler> = {
        [CompilerTypes.ALGODEBUG]: new AlgoDebugCompilerImpl(),
        [CompilerTypes.CODEX]: new CodeXCompilerImpl(),
        [CompilerTypes.JDOODLE]: new JDoodleCompilerImpl(),
    };
    return compilerMap[process.env.COMPILER as CompilerTypes] ?? new AlgoDebugCompilerImpl();
}
