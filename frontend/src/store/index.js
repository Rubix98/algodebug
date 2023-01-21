import { createStore } from "vuex";
import project from "./modules/project";
import cachedLists from "./modules/cachedLists";
import user from "./modules/user";

export default createStore({
    modules: {
        project,
        cachedLists,
        user,
    },
});
