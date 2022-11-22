String.prototype.getWordsArray = function() {
	let text = this.replace(/[^A-Za-z0-9_]+/g, " ").trim();
	return text.split(" ");
}

String.prototype.replaceFromIndex = function(from, to, index) {
	if (index < 0) {
		index = 0;
	}
	return this.substr(0, index) + this.substr(index).replace(from, to);
}

String.prototype.escapeHTML = function() {
	let escaped = this.replace(/<\/*algodebug-[^>]*>/g, tag => {
		return tag.replace("<", "[").replace(">", "]");
	})

	escaped = new Option(escaped).innerHTML;
	
	escaped = escaped.replace(/\[\/*algodebug-[^\]]*\]/g, tag => {
		return tag.replace("[", "<").replace("]", ">");
	})

	//escaped = escaped.replace("\t", "    ");
	return escaped + "\n";
}

String.prototype.numberOfLines = function() {
	return this.split("\n").length;
}