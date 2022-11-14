export class HighlightUtils {
	static selectVariable(code, cursorPosition) {
		const isAllowedCharacter = function(ch) {
				return ch != undefined && (/[a-zA-Z0-9_]/).test(ch);
		}
		
		if (!isAllowedCharacter(code[cursorPosition]) && isAllowedCharacter(code[cursorPosition-1])) {
				cursorPosition--;
		} else if (!isAllowedCharacter(code[cursorPosition]) && !isAllowedCharacter(code[cursorPosition-1])) {
				return null;
		}

		let start = cursorPosition, end = cursorPosition;
		while (isAllowedCharacter(code[start-1])) {
				start--;
		}
		while (isAllowedCharacter(code[end])) {
				end++;
		}

		let variableName = code.slice(start, end);
		return {id: variableName, start: start, end: end};
	}

	static insertTargetTagsIntoCode(code) {
		let result = code;
		let codeIndex = 0;
		let resultIndex = 0;

		for (let word of code.getWordsArray()) {
			let start = code.indexOf(word, codeIndex);
			let end = start + word.length;

			result = result.replaceFromIndex(word, `<algodebug-highlight-target start=${start} end=${end}>${word}</algodebug-highlight-target>`, resultIndex);

			codeIndex = end;
			resultIndex = result.lastIndexOf('</algodebug-highlight-target>') + '</algodebug-highlight-target>'.length;
		}
		return result;
	}

	static highlightLine(code, lineNumber) {
		let lines = code.split('\n');
    let line = lines[lineNumber];
		line = line !== '' ? line : ' ';
		line = '<algodebug-highlight-line>' + line + '</algodebug-highlight-line>';
    lines[lineNumber] = line;
		code = lines.join('\n');
		return code;
	}

	static highlightVariables(code, variables) {
		for (let variable of variables.sortedBy('start', -1)) {
			code = code.slice(0, variable.start) + '<algodebug-highlight-variable>' + code.slice(variable.start, variable.end) + '</algodebug-highlight-variable>' + code.slice(variable.end);
		}
		return code;
	}
}