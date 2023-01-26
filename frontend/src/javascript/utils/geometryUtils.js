export function rescalePoints(points) {
    const sceneBoundingBoxSize = 400;

    let minX = points
        .map(function (point) {
            return point.x;
        })
        .getMinValue();
    let maxX = points
        .map(function (point) {
            return point.x;
        })
        .getMaxValue();
    let minY = points
        .map(function (point) {
            return point.y;
        })
        .getMinValue();
    let maxY = points
        .map(function (point) {
            return point.y;
        })
        .getMaxValue();

    let scaleFactor = { x: 1, y: 1 };
    if (maxX - minX != 0) scaleFactor.x = sceneBoundingBoxSize / (maxX - minX);
    if (maxY - minY != 0) scaleFactor.y = sceneBoundingBoxSize / (maxY - minY);

    for (let point of points) {
        point.x = (point.x - minX - (maxX - minX) / 2) * scaleFactor.x;
        point.y = (point.y - minY - (maxY - minY) / 2) * scaleFactor.y;
    }
}
