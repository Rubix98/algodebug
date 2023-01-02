Array.prototype.toggleElement = function (element) {
    if (this.hasId(element.id)) {
        this.deleteById(element.id);
    } else {
        this.addElement(element);
    }
};

Array.prototype.addElement = function (element) {
    const id = element.id ?? this.generateUniqueId();
    const index = this.findIndexForId(id);
    if (index !== -1) {
        this[index] = element;
    } else {
        this.push({ id, ...element });
    }
};

Array.prototype.deleteById = function (id) {
    const index = this.findIndexForId(id);
    if (index !== -1) {
        this.splice(index, 1);
    }
};

Array.prototype.findById = function (id) {
    return this.find((element) => element.id === id);
};

Array.prototype.findIndexForId = function (id) {
    return this.findIndex((element) => element.id === id);
};

Array.prototype.hasId = function (id) {
    return this.some((element) => element.id === id);
};

Array.prototype.sortedBy = function (key, order = 1) {
    return this.sort((a, b) => {
        return a[key] > b[key] ? order : -order;
    });
};

Array.prototype.generateUniqueId = function () {
    const ids = Array.from(this.keys());
    return ids.length > 0 ? Math.max(...ids) : 0;
};
