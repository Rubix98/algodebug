export function highlightLine(code, lineNumber) {
	let lines = code.split('\n');
	let line = lines[lineNumber];
	line = line !== '' ? line : ' ';
	line = '<algodebug-highlight-line>' + line + '</algodebug-highlight-line>';
	lines[lineNumber] = line;
	code = lines.join('\n');
	return code;
}

export function highlightVariables(code, variables) {
	for (let variable of variables.sortedBy('start', -1)) {
		code = code.slice(0, variable.start) + '<algodebug-highlight-variable>' + code.slice(variable.start, variable.end) + '</algodebug-highlight-variable>' + code.slice(variable.end);
	}
	return code;
}

export function highlightTargets(code) {
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
