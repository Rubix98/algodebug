export function rescalePoints(points) {
    const sceneBoundingBoxSize = 400;

    let minX = points
        .map(function (point) {
            return point.x;
        })
        .arrayMin();
    let maxX = points
        .map(function (point) {
            return point.x;
        })
        .arrayMax();
    let minY = points
        .map(function (point) {
            return point.y;
        })
        .arrayMin();
    let maxY = points
        .map(function (point) {
            return point.y;
        })
        .arrayMax();

    let scalar = { x: 1, y: 1 };
    if (maxX - minX != 0) scalar.x = sceneBoundingBoxSize / (maxX - minX);
    if (maxY - minY != 0) scalar.y = sceneBoundingBoxSize / (maxY - minY);

    for (let point of points) {
        point.x = (point.x - minX - (maxX - minX) / 2) * scalar.x;
        point.y = (point.y - minY - (maxY - minY) / 2) * scalar.y;
    }
}
