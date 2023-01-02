Array.prototype.toggleElement = function (element) {
    if (this.hasId(element.id)) {
        this.deleteById(element.id);
    } else {
        this.addElement(element);
    }
};

Array.prototype.addElement = function (element) {
    const id = element.id ?? this.generateUniqueId();
    console.log(id);
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

Array.prototype.ids = function () {
    return this.map((element) => element.id);
};

Array.prototype.sortedBy = function (key, order = 1) {
    return this.sort((a, b) => {
        return a[key] > b[key] ? order : -order;
    });
};

Array.prototype.generateUniqueId = function () {
    const ids = this.ids();
    return ids.length > 0 ? Math.max(...ids) + 1 : 0;
};

Array.prototype.firstId = function () {
    return this.length !== 0 ? this[0].id : null;
};

Array.prototype.lastId = function () {
    return this.length !== 0 ? this[this.length - 1].id : null;
};

Array.prototype.nextId = function (id) {
    const index = this.findIndexForId(id);
    return index !== this.length - 1 ? this[index + 1].id : null;
};

Array.prototype.prevId = function (id) {
    const index = this.findIndexForId(id);
    return index !== 0 ? this[index - 1].id : null;
};
