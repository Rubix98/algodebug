import toast from "@/javascript/utils/toastUtils";

export function validateSceneObject(model) {
    if (!assert(model.type != null, "Podaj rodzaj obiektu")) return false;
    if (!assert(model.variable != null, "Przypisz zmienną")) return false;
    let problemWithSubobject = false;
    model.subobjects.forEach((subObj) => {
        if (!assert(subObj.type != null, "Podaj rodzaj właściwości")) return (problemWithSubobject = true);
        if (!assert(subObj.variable != null, "Przypisz zmienną do właściwości")) return (problemWithSubobject = true);
    });
    if (problemWithSubobject) return false;
    return true;
}

function assert(assertion, warning) {
    if (!assertion) {
        toast.error(warning);
        return false;
    }
    return true;
}
