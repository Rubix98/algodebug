const SCENE_OBJECT_TYPES = [
    { key: "variable", label: "Zmienna" },

    { key: "graph", label: "Graf" },
    { key: "graph_edges", label: "Wyróżnienie krawędzi" },
    { key: "graph_vertices", label: "Wyróżnienie wierzchołków" },
    { key: "graph_path", label: "Ścieżka" },

    { key: "array", label: "Tablica" },
    { key: "array_index", label: "Wyróżnienie komórek" },
    { key: "array_part", label: "Przedział" },

    { key: "points", label: "Zbiór punktów" },
    { key: "points_point", label: "Wyróżnienie punktów" },
    { key: "points_stretch", label: "Odcinki" },
    { key: "points_path", label: "Łamana" },

    { key: "circle", label: "Okrąg" },

    { key: "shape", label: "Wielokąt" },
];

export function getSceneObjectTypes(parent = null) {
    if (parent == null) {
        return SCENE_OBJECT_TYPES.filter((type) => !type.key.includes("_"));
    } else {
        return SCENE_OBJECT_TYPES.filter((type) => type.key.startsWith(parent + "_"));
    }
}

export function getSceneObjectTypeLabel(key) {
    return SCENE_OBJECT_TYPES.find((type) => type.key === key)?.label;
}

export function hasSubtypes(key) {
    return SCENE_OBJECT_TYPES.some((type) => type.key.startsWith(key + "_"));
}
