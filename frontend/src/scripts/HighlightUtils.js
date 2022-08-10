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

			result = result.replaceFromIndex(word, `<algo-target start=${start} end=${end}>${word}</algo-target>`, resultIndex);

			codeIndex = end;
			resultIndex = result.lastIndexOf('</algo-target>') + '</algo-target>'.length;
		}
		return result.escapeHTML();
	}

	static highlightLine(code, lineNumber) {
		let lines = code.split('\n');
        let line = lines[lineNumber];
		line = line !== '' ? line : ' ';
		line = '<highlight class="highlight-line">' + line + '</highlight>';
        lines[lineNumber] = line;
		code = lines.join('\n');
		return this.sanitizeCode(code);
	}

	static highlightVariables(code, variables) {
		console.log(code, variables);
		for (let variable of variables.sortedBy('start', -1)) {
			console.log(variable);
			code = code.slice(0, variable.start) + '<algo-highlight class="highlight-variable">' + code.slice(variable.start, variable.end) + '</algo-highlight>' + code.slice(variable.end);
		}
		return code.escapeHTML();
	}
}