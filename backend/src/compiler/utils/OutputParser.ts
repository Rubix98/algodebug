import { CodeBreakpoint, CodeOutput } from "../types";
import { parse } from "node-html-parser";

const BREAKPOINT_TAG = "algodebug-breakpoint";
const SCENEOBJECT_TAG = "algodebug-object";

const BREAKPOINT_BEGIN_TAG = "<algodebug-breakpoint";
const BREAKPOINT_END_TAG = "</algodebug-breakpoint>\n";

type Breakpoint = {
    tag: string;
    start: number;
    end: number;
};

export class OutputParser {
    output: string = "";
    position: number = 0;

    constructor(output: string) {
        this.output = output;
    }

    parse(): CodeOutput {
        let result: CodeOutput = {
            partialOutputs: [],
            frames: [],
        };

        do {
            var [found, breakpoint] = this.findNextBreakpoint();
            if (found && breakpoint) {
                result.partialOutputs.push(this.output.substring(this.position, breakpoint.start));
                result.frames.push(this.parseBreakpoint(breakpoint, result.frames.length));
                this.position = breakpoint.end;
            }
        } while (found);
        if (!this.output.substring(this.position).includes(BREAKPOINT_TAG)) {
            result.partialOutputs.push(this.output.substring(this.position));
        }

        return result;
    }

    findNextBreakpoint(): [true, Breakpoint] | [false] {
        let breakpointStart = this.output.indexOf(BREAKPOINT_BEGIN_TAG, this.position);
        let breakpointEnd = this.output.indexOf(BREAKPOINT_END_TAG, this.position);
        if (breakpointStart === -1 || breakpointEnd === -1) {
            return [false];
        }

        let breakpointTag = this.output.substring(breakpointStart, breakpointEnd);
        let breakpoint = {
            tag: breakpointTag,
            start: breakpointStart,
            end: breakpointEnd + BREAKPOINT_END_TAG.length,
        };

        return [true, breakpoint];
    }

    parseBreakpoint(breakpoint: Breakpoint, id: number): CodeBreakpoint {
        const parsedBreakpoint = parse(breakpoint.tag).getElementsByTagName(BREAKPOINT_TAG)[0];
        let line = Number(parsedBreakpoint.getAttribute("line"));

        let sceneObjects: Record<string, string> = {};
        for (let sceneObject of parsedBreakpoint.getElementsByTagName(SCENEOBJECT_TAG)) {
            let objectId = sceneObject.getAttribute("id");
            let objectValue = sceneObject.innerHTML;
            if (objectId) {
                sceneObjects[objectId] = objectValue;
            }
        }

        return { id, line, sceneObjects };
    }

    parseVariable(sceneObject: Element) {
        return [sceneObject.getAttribute("name"), sceneObject.innerHTML];
    }
}
