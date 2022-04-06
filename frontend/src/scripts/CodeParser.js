export class CodeParser {
	constructor(code) {
		this.code = code;
		this.tags = [
			{id: 0, position: 0, parent: this, name: '<mark>',			 	action: this.markAction},
			{id: 1, position: 0, parent: this, name: '<breakpoint>', 	action: this.breakpointAction},
			{id: 2, position: 0, parent: this, name: '{',							action: this.openingCurlyBracketAction},
			{id: 3, position: 0, parent: this, name: '}',							action: this.closingCurlyBracketAction},
			{id: 4, position: 0, parent: this, name: '(',							action: this.openingRoundBracketAction},
			{id: 5, position: 0, parent: this, name: ')',	 						action: this.closingRoundBracketAction},
		];
		this.updateAllTags();
	}

	static getSelectedMark(code, cursorPosition) {
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
		return {name: variableName, start: start, end: end};
	}

	static highlightLine(code, line, style) {
		let lines = code.split('\n');
		lines[line] = lines[line] !== '' ? lines[line] : ' ';
		lines[line] = `<mark>${lines[line]}</mark>`;
		code = lines.join('\n');
		code = code.replaceAll('<', '&lt');
		code = code.replaceAll('>', '&gt');
		code = code.replaceAll('&ltmark&gt', `<mark style="${style}">`);
		code = code.replaceAll('&lt/mark&gt', '</mark>');
		return code;
	}

	static highlightCode(code, marks, style) {
		code = this.insertMarkTags(code, marks);
		code = code.replaceAll('<', '&lt');
		code = code.replaceAll('>', '&gt');
		code = code.replaceAll('&ltmark&gt', `<mark style="${style}">`);
		code = code.replaceAll('&lt/mark&gt', '</mark>');
		return code;
	}

	static extendCode(code, marks, breakpoints) {
		code = this.insertMarkTags(code, marks);
		code = this.insertBreakpointTags(code, breakpoints);
		let codeParser = new CodeParser(code);
		codeParser.parse();
		codeParser.insertPrintLines(breakpoints);
		codeParser.removeMarks();
		return codeParser.code;
	}

	static insertMarkTags(code, marks) {
		for (let mark of marks.sortedBy('start', -1)) {
			code = code.slice(0, mark.start) + '<mark>' + code.slice(mark.start, mark.end) + '</mark>' + code.slice(mark.end);
		}
		return code;
	}

	static insertBreakpointTags(code, breakpoints) {
		let lines = code.split('\n');
		for (let breakpoint of breakpoints.reversed()) {
			lines[breakpoint-1] += "<breakpoint>";
		}
		code = lines.join('\n');
		return code;
	}

	parse() {
		this.breakpointsVariables = [];
		this.stack = [];
		this.roundBracketsLevel = 0;
		this.curlyBracketsLevel = 0;

		while (this.findNextTag()) {
				let tag = this.findNextTag();
				tag.action(tag);
				this.updateTag(tag);
		}
	}

	insertPrintLines(breakpoints) {
		
		breakpoints = breakpoints.sorted();
		for (let [i, breakpointVariables] of this.breakpointsVariables.entries()) {
			let cout = '\tstd::cout << "<ALGOVIEW>\\n"'
			cout += ` << "  <variable name=\\"line\\" value=\\"" << ${breakpoints[i]} << "\\" />\\n"`;
			for (let variable of breakpointVariables) {
				cout += ` << "  <variable name=\\"${variable}\\" value=\\"" << ${variable} << "\\" />\\n"`;
			}
			cout += ' << "</ALGOVIEW>\\n";';
			this.code = this.code.replace('<breakpoint>', cout);
		}
	}
	
	removeMarks() {
		this.code = this.code.replaceAll('<mark>', '');
		this.code = this.code.replaceAll('</mark>', '');
	}

	updateAllTags() {
		for (let tag of this.tags) {
			this.updateTag(tag);
		}
	}

	updateTag(tag) {
		tag.position = this.code.indexOf(tag.name, tag.position+1);
		tag.position = tag.position !== -1 ? tag.position : this.code.length;
		this.tags[tag.id] = tag;
	}

	findNextTag() {
		let result = this.tags[0];
		for (let tag of this.tags) {
			if (tag.position < result.position) {
				result = tag;
			}
		}
		if (result.position !== this.code.length) {
			return result;
		}
	}

	markAction(tag) {
		let beginIndex = tag.position + tag.name.length;
		let endIndex = this.parent.code.indexOf('</mark>', beginIndex);
		let variableName = this.parent.code.slice(beginIndex, endIndex);
		let variableLevel = this.parent.curlyBracketsLevel + (this.parent.roundBracketsLevel? 1 : 0);
		this.parent.stack.push({variableName: variableName, level: variableLevel});
	}

	breakpointAction() {
		this.parent.breakpointsVariables.push(this.parent.stack.map(el => el.variableName));
	}

	openingCurlyBracketAction() {
		this.parent.curlyBracketsLevel++;
	}

	closingCurlyBracketAction() {
		while (this.parent.stack.length > 0 && this.parent.stack.at(-1).level == this.parent.curlyBracketsLevel) {
			this.parent.stack.pop();
		}
		this.parent.curlyBracketsLevel--;
	}

	openingRoundBracketAction() {
		this.parent.roundBracketsLevel++;
	}

	closingRoundBracketAction() {
		this.parent.roundBracketsLevel--;
	}
}