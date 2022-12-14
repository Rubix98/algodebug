<template>
    <div class="bottom-buttons">
        <v-fab-transition>
            <RunButton />
        </v-fab-transition>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import RunButton from "@/components/bottomButtons/buttons/RunButton.vue";

export default defineComponent({
    name: "BottomButtons",
    components: { RunButton },
});
</script>

<style lang="scss" scoped>
div.bottom-buttons {
    position: fixed;
    right: 20px;
    bottom: 20px;
}
</style>
