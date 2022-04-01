export class DeepSet extends Set {

	DeepSet(array) {
		for (let element of array) {
			this.add(element);
		}
	}

	addOrDelete(element) {
		if (element) {
			let foundElement = this.find(element);
			if (foundElement) {
				this.delete(foundElement);
			} else {
				this.add(element)
			}
		}
	}

	sortedBy(fieldName, order=1) {
		let array = Array.from(this);
		if (fieldName != undefined) {
			array.sort((a, b) => {
				return a[fieldName] > b[fieldName] ? order : a[fieldName] < b[fieldName] ? -order : 0;
			})
		} else {
			array.sort((a, b) => {
				return a > b ? order : a < b ? -order : 0;
			})
		}
		return array;
	}

	reversed() {
		return Array.from(this).reverse();
	}

	sorted() {
		return Array.from(this).sort((a, b) => a - b);
	}

	toArray() {
		return Array.from(this);
	}

	find(element) {
		for (let el of this) {
			if (this.deepCompare(el, element)) {
				return el;
			}
		}
	}

	deepCompare(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
}