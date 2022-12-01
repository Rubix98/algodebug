Map.prototype.addOrDelete = function (element) {
    if (element == null) {
        return;
    }
    if (this.hasElement(element)) {
        this.deleteElement(element);
    } else {
        this.addElement(element);
    }
};

Map.prototype.addElement = function (element) {
    this.set(element.id, element);
};

Map.prototype.deleteElement = function (element) {
    this.delete(element.id);
};

Map.prototype.hasElement = function (element) {
    return this.has(element.id);
};

Map.prototype.sortedBy = function (key, order = 1) {
    return this.toArray().sort((a, b) => {
        a = a[key];
        b = b[key];
        return a > b ? order : -order;
    });
};

Map.prototype.toArray = function () {
    return Array.from(this.values());
};

Map.prototype.reversed = function () {
    return this.toArray().reverse();
};
