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
		for (let variable of variables.sortedBy('start', -1)) {
			console.log(variable);
			code = code.slice(0, variable.start) + '<highlight class="highlight-variable">' + code.slice(variable.start, variable.end) + '</highlight>' + code.slice(variable.end);
		}
		return this.sanitizeCode(code);
	}

    static sanitizeCode(code) {
        code = code
                .replaceAll('<', '&lt')
                .replaceAll('>', '&gt')
                .replaceAll('&lthighlight class="highlight-variable"&gt', '<highlight class="highlight-variable">')
				.replaceAll('&lthighlight class="highlight-line"&gt', '<highlight class="highlight-line">')
                .replaceAll('&lt/highlight&gt', '</highlight>');
        return code;
    }
}