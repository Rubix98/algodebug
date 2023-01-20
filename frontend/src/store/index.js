import { createStore } from "vuex";
import cachedLists from "./modules/cachedLists";

export default createStore({
    modules: {
        cachedLists,
    },
});
