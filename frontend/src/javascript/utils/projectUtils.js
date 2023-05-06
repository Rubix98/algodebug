import {sendRequest} from "@/javascript/utils/axiosUtils";

export function deleteProject(projectId) {
    return sendRequest(`/project/${projectId}`, null, "DELETE");
}
