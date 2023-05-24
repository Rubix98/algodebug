import { useProjectStore } from "@/stores/project";

export function handleShortcuts(event, emitter) {
    let handled = false;
    if (event.type == "keydown") {
        let key = event.key.toLowerCase();
        let caps = event.getModifierState("CapsLock");
        let shift = event.getModifierState("Shift");
        if (caps) shift = !shift;
        let ctrl = event.getModifierState("Control");
        if (!shift && ctrl && key === "s") {
            useProjectStore().saveProject(useProjectStore().title, true);
            handled = true;
        } else if (shift && ctrl && key === "s") {
            emitter.emit("open-save-project-modal-shortcut");
            handled = true;
        } else if (!shift && ctrl && key === "arrowleft") {
            if (useProjectStore().isRunning) {
                emitter.emit("first-frame-shortcut");
                handled = true;
            }
        } else if ((!shift && !ctrl && key === "arrowleft") || (!shift && !ctrl && key === "pageup")) {
            if (useProjectStore().isRunning) {
                emitter.emit("previous-frame-shortcut");
                handled = true;
            }
        } else if (!shift && !ctrl && key === " ") {
            emitter.emit("toggle-animation-shortcut");
            if (useProjectStore().isRunning) {
                handled = true;
            }
        } else if ((!shift && !ctrl && key === "arrowright") || (!shift && !ctrl && key === "pagedown")) {
            if (useProjectStore().isRunning) {
                emitter.emit("next-frame-shortcut");
                handled = true;
            }
        } else if (!shift && ctrl && key === "arrowright") {
            if (useProjectStore().isRunning) {
                emitter.emit("last-frame-shortcut");
                handled = true;
            }
        } else if (!shift && ctrl && key === "r") {
            emitter.emit("run-project-shortcut");
            handled = true;
        } else if (!shift && ctrl && key === "n") {
            //Przeglądarka (przynajmniej moja) przechwytuje Ctrl+n więc trzeba zamienić na coś innego
            emitter.emit("create-new-project-shortcut");
            handled = true;
        } else if (!shift && ctrl && key === "o") {
            emitter.emit("open-load-project-modal-shortcut");
            handled = true;
        } else if (!shift && ctrl && key === "d") {
            emitter.emit("show-extended-code-shortcut");
            handled = true;
        }
    }
    if (handled) {
        event.preventDefault();
    }
}
