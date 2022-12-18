import { createStore } from "vuex";
import project from "./modules/project";
import cachedLists from "./modules/cachedLists";

export default createStore({
    modules: {
        project,
        cachedLists,
    },
});
