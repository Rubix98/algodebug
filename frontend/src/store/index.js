import { createStore } from "vuex";
import project from "./modules/project";

export default createStore({
    modules: {
        project,
    },
});
