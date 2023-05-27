const parsingMap = {
    graph: parseGraph,
    graph_edges: parseEdges,
    graph_vertices: parseArray,
    graph_path: parseArray,

    points: parsePoints,
    points_stretch: parseArrayOfPairs,
    points_point: parseArray,
    points_path: parseArray,

    circle: parseCircles,
    shape: parsePoints,
    array: parseArrayOrString,

    chart: parsePoints,

    array_index: parseArray,
    array_part: parseArrayOfPairs,
};

export function parse(value, type) {
    value = value.trim();
    return parsingMap[type] ? parsingMap[type](value) : value;
}

function parseGraph(value) {
    let graph = {
        vertices: new Set(),
        edges: [],
    };

    for (let edge of value.split("\n")) {
        if (!edge) continue;
        edge = edge.split(" ");
        let a = Number(edge[0]);
        let b = Number(edge[1]);
        let d = edge[2] ? Number(edge[2]) : 0;

        graph.vertices.add(a);
        graph.vertices.add(b);
        graph.edges.push({ a, b, d });
    }
    graph.vertices = [...graph.vertices];
    graph.vertices.sort();

    return graph;
}

function parseEdges(value) {
    let edges = [];

    for (let edge of value.split("\n")) {
        if (!edge) continue;
        edge = edge.split(" ");
        let a = Number(edge[0]);
        let b = Number(edge[1]);
        let d = edge[2] ? Number(edge[2]) : 0;

        edges.push({ a, b, d });
    }

    return edges;
}

function parseArray(value) {
    let array = [];
    const delimiter = value.includes("\n") ? "\n" : " ";
    for (let element of value.split(delimiter)) {
        if (!element) continue;
        array.push(element);
    }

    return array;
}

function parsePoints(value) {
    let points = [];

    for (let point of value.split("\n")) {
        if (!point) continue;
        point = point.split(" ");
        points.push({
            x: Number(point[0]),
            y: Number(point[1]),
        });
    }

    return points;
}

function parseArrayOfPairs(value) {
    let array = [];

    for (let element of value.split("\n")) {
        if (!element) continue;
        element = element.split(" ");
        array.push([element[0], element[1]]);
    }

    return array;
}

function parseCircles(value) {
    let circles = [];

    for (let circle of value.split("\n")) {
        if (!circle) continue;
        circle = circle.split(" ");
        circles.push({
            x: Number(circle[0]),
            y: Number(circle[1]),
            r: Number(circle[2]),
        });
    }

    return circles;
}

function parseArrayOrString(value) {
    return value.includes(" ") || value.includes("\n") ? parseArray(value) : value;
}
