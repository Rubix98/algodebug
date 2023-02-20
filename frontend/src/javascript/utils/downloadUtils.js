import * as pdfMake from "pdfmake/build/pdfmake";
import { useProjectStore } from "@/stores/project";
import { getCurrentThemeFromStorage } from "@/javascript/storage/themeStorage";

export function exportToPDF(stage) {
    const projectStore = useProjectStore();
    var documentDefinition = getBlankPDFDocumentDefinition();
    const drawableWidth = documentDefinition.pageSize.width - 2 * documentDefinition.pageMargins[0];
    const drawableHeight = documentDefinition.pageSize.height - 2 * documentDefinition.pageMargins[1];

    for (let frame of projectStore.allFrames) {
        stage.draw(projectStore.sceneObjects, frame, projectStore.updateSceneObjectPosition);
        documentDefinition.images["frame_" + frame.id] = stage.getBase64Image();
        documentDefinition.content.push({
            image: "frame_" + frame.id,
            fit: [drawableWidth, drawableHeight],
            pageBreak: "after",
        });
    }
    stage.draw(projectStore.sceneObjects, projectStore.currentFrame, projectStore.updateSceneObjectPosition);

    if (documentDefinition.content.length > 0) {
        documentDefinition.content[documentDefinition.content.length - 1].pageBreak = undefined;
    }

    pdfMake.createPdf(documentDefinition).download("algodebug.pdf");
}

export function exportToPNG(stage) {
    let uri = stage.getBase64Image();
    downloadFile("algodebug.png", uri);
}

function downloadFile(name, uri) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getBlankPDFDocumentDefinition() {
    return {
        pageSize: {
            width: 595.28,
            height: 841.89,
        },
        pageMargins: [20, 30],
        background: function () {
            if (getCurrentThemeFromStorage() === "light") return;
            return {
                canvas: [
                    {
                        type: "rect",
                        x: 0,
                        y: 0,
                        w: 595.28,
                        h: 841.89,
                        color: "#212121",
                    },
                ],
            };
        },
        content: [],
        images: {},
    };
}
