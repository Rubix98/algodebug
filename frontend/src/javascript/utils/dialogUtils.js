import { formatDate } from "./other";

export function getDialogDataForProject(project) {
    return {
        properties: [
            { label: "Tytuł", value: project.title },
            { label: "Autor", value: project.author },
            { label: "Data modyfikacji", value: formatDate(project.modificationDate) },
        ],
    };
}

export function getDialogDataForConverter(converter) {
    return {
        properties: [
            { label: "Nazwa", value: converter.title },
            { label: "Kod", value: converter.code, fieldType: "textarea" },
        ],
    };
}
