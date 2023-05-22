import { useProjectStore } from "@/stores/project";

export function handleShortcuts(event, emitter) {
    let handled = false;
    if (event.type == "keydown") {
        if (event.ctrlKey && event.key === "s") {
            useProjectStore().saveProject(useProjectStore().title, true)
            handled = true;
        } else if (event.shiftKey && event.ctrlKey && event.key === "S") {
            emitter.emit("open-save-project-modal-shortcut");
            handled = true;
        } else if (event.ctrlKey && event.key === "ArrowLeft") {
            if (useProjectStore().isRunning) {
                emitter.emit("first-frame-shortcut");
                handled = true;
            }
        } else if (
            (!event.ctrlKey && event.key === "ArrowLeft") ||
            (!event.ctrlKey && event.key === "PageUp")
        ) {
            if (useProjectStore().isRunning) {
                emitter.emit("previous-frame-shortcut");
                handled = true;
            }
        } else if (!event.ctrlKey && event.key === " ") {
            emitter.emit("toggle-animation-shortcut");
            if (useProjectStore().isRunning) {
                handled = true;
            }
        } else if (
            (!event.ctrlKey && event.key === "ArrowRight") ||
            (!event.ctrlKey && event.key === "PageDown")
        ) {
            if (useProjectStore().isRunning) {
                emitter.emit("next-frame-shortcut");
                handled = true;
            }
        } else if (event.ctrlKey && event.key === "ArrowRight") {
            if (useProjectStore().isRunning) {
                emitter.emit("last-frame-shortcut");
                handled = true;
            }
        } else if (event.ctrlKey && event.key === "r") {
            emitter.emit("run-project-shortcut");
            handled = true;
        } else if (event.ctrlKey && event.key === "n") {
            //Przeglądarka (przynajmniej moja) przechwytuje Ctrl+n więc trzeba zamienić na coś innego
            emitter.emit("create-new-project-shortcut");
            handled = true;
        } else if (event.ctrlKey && event.key === "o") {
            emitter.emit("open-load-project-modal-shortcut");
            handled = true;
        } else if (event.ctrlKey && event.key === "d") {
            emitter.emit("show-extended-code-shortcut");
            handled = true;
        }
    }
    if (handled) {
        event.preventDefault();
    }
}