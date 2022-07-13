export class TestCases {
    testCases; selectedId;
    constructor() {
        this.testCases = [];
        this.addTestCase();
    }

    addTestCase() {
        this.selectedId = this.length();
        this.testCases.push(new TestCase(this.selectedId));
    }

    current() {
        return this.testCases[this.selectedId];
    }

    length() {
        return this.testCases.length;
    }
}

class TestCase {
    id; input; output;
    constructor(id) {
        this.id = id;
        this.input = '';
    }
}