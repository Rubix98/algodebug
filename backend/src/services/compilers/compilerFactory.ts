import { CompilerRequest, CompilerResponse } from "../../types/compiler";
import { CodeXCompiler } from "./CodeXCompiler"
import { JDoodleCompiler } from "./JDoodleCompiler";

export enum CompilerTypes {
  CODEX = "CODEX",
  JDOODLE = "JDOODLE",
}

export interface ICompiler {
  compile(request: CompilerRequest): Promise<CompilerResponse>
}

export function getCompiler():ICompiler {
  const compilerMap: Record<CompilerTypes, ICompiler> = {
    [CompilerTypes.CODEX]: new CodeXCompiler(),
    [CompilerTypes.JDOODLE]: new JDoodleCompiler()
  }
  return compilerMap[process.env.COMPILER as CompilerTypes];
}