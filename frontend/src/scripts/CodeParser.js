export class CodeParser {
	actions = {
		'<variable>': function(parent, tag) {
			let beginIndex = tag.position + tag.key.length;
			let endIndex = parent.code.indexOf('</variable>', beginIndex);
			let variableName = parent.code.slice(beginIndex, endIndex);
			let variableLevel = parent.curlyBracketsLevel + (parent.roundBracketsLevel ? 1 : 0);
			let variableType = parent.variables.get(variableName).type;
			parent.variablesStack.push({name: variableName, level: variableLevel, type: variableType});
		},
		'<breakpoint/>': function(parent) {
			parent.breakpointVariables.push(parent.variablesStack);
		},
		'{': function(parent) {
			parent.curlyBracketsLevel++;
		},
		'}': function(parent) {
			parent.variablesStack = parent.variablesStack.filter(variable => variable.level < parent.curlyBracketsLevel)
			parent.curlyBracketsLevel--;
		},
		'(': function(parent) {
			parent.roundBracketsLevel++;
		},
		')': function(parent) {
			parent.roundBracketsLevel--;
		}
	};

	constructor(code, variables, breakpoints) {
		this.code = code;
		this.variables = variables;
		this.breakpoints = breakpoints;

		this.breakpointVariables = [];
		this.variablesStack = [];
		this.roundBracketsLevel = 0;
		this.curlyBracketsLevel = 0;
	}

	parse() {
		this.prepareCode();
		this.initializeTags();

		while (this.findNextTag()) {
			let tag = this.findNextTag();
			tag.action(this, tag);
			this.updateTagPosition(tag);
		}

		this.parseCode();
		return this.code;
	}

	initializeTags() {
		this.tags = [];
		for (let actionKey in this.actions) {
			this.tags.push({
				id: this.tags.length,
				key: actionKey,
				position: 0,
				action: this.actions[actionKey]
			})
		}
		this.updateAllTagsPosition();
	}

	updateAllTagsPosition() {
		for (let tag of this.tags) {
			this.updateTagPosition(tag);
		}
	}

	updateTagPosition(tag) {
		let position = this.code.indexOf(tag.key, tag.position+1);
		position = position !== -1 ? position : this.inf;
		this.tags[tag.id].position = position;
	}

	findNextTag() {
		let result = null;
		for (let tag of this.tags) {
			if (tag.position !== this.inf && (result == null || tag.position < result.position)) {
				result = tag;
			}
		}
		return result;
	}

	prepareCode() {
		this.code = CodeUtils.insertVariableTags(this.code, this.variables);
		this.code = CodeUtils.insertBreakpointTags(this.code, this.breakpoints);
	}

	parseCode() {
		this.code = CodeUtils.removeVariableTags(this.code);
		this.code = CodeUtils.replaceBreakpointTags(this.code, this.breakpointVariables);
	}
}

class CodeUtils {
	static insertVariableTags(code, variables) {
		for (let variable of variables.sortedBy('start', -1)) {
			code = code.slice(0, variable.start) + '<variable>' + code.slice(variable.start, variable.end) + '</variable>' + code.slice(variable.end);
		}
		return code;
	}

	static insertBreakpointTags(code, breakpoints) {
		let lines = code.split('\n');
		for (let breakpoint of breakpoints.reversed()) {
			lines[breakpoint.id] += "<breakpoint/>";
		}
		code = lines.join('\n');
		return code;
	}

	static removeVariableTags(code) {
		code = code
				.replaceAll('<variable>', '')
				.replaceAll('</variable>', '');
		return code;
	}

	static replaceBreakpointTags(code, breakpointVariables) {
		for (let breakpoint of breakpointVariables) {
			let variables = breakpoint
				.map(variable => `VariableData("${variable.name}", "${variable.type}", ${variable.type}(${variable.name}).toString())`)
				.join(",\t");
			code = code.replace('<breakpoint/>', ` algoPrint({${variables}});`);
		}
		return code;
	}
}