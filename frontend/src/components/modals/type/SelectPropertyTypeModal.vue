<template>
    <AlgoModal title="Wybierz typ obiektu wewnętrznego">
        <AlgoPickList :options="types" @selectOptionEvent="handleSelectOption" />
    </AlgoModal>
</template>

<script>
    import AlgoModal from "@/components/global/AlgoModal.vue";
    import AlgoPickList from "@/components/global/AlgoPickList.vue";
    import { getSceneObjectTypes } from "@/javascript/utils/sceneObjectTypesUtils";
    import { popModal } from "jenesius-vue-modal";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoModal, AlgoPickList },

        props: ["sceneObjectType", "callback"],

        methods: {
            handleSelectOption(selectedOption) {
                this.$props.callback(selectedOption);
                popModal();
            },
        },

        computed: {
            types() {
                return getSceneObjectTypes(this.$props.sceneObjectType);
            },
        },
    });
</script>
