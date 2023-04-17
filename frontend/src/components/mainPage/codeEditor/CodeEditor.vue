<script>
    import { defineComponent } from "vue";
    import CodeViewer from "./CodeViewer.vue";
    import { pushModal } from "jenesius-vue-modal";
    import ConfigureSceneObjectModal from "@/components/modals/sceneObject/ConfigureSceneObjectModal.vue";
    import { KeyMod, KeyCode } from "monaco-editor/esm/vs/editor/editor.main";
    import { mapActions } from "pinia";
    import { useProjectStore } from "@/stores/project";

    export default defineComponent({
        extends: CodeViewer,

        mounted() {
            this.editor.addAction({
                id: "fast-add-sceneobject",
                label: "Śledź zmienną",
                keybindings: [KeyMod.CtrlCmd | KeyCode.F10],

                contextMenuGroupId: "navigation",
                contextMenuOrder: 1,

                run: () => {
                    const variable = this.getVariableInPosition(this.editor.getPosition());
                    const sceneObject = {
                        type: "variable",
                        variables: [variable],
                        converter: null,
                        subobjects: [],
                    };

                    this.addSceneObject(sceneObject);
                },
            });

            this.editor.addAction({
                id: "add-sceneobject",
                label: "Nowy obiekt sceniczny",
                keybindings: [KeyMod.CtrlCmd | KeyCode.F11],

                contextMenuGroupId: "navigation",
                contextMenuOrder: 2,

                run: () => {
                    const variable = this.getVariableInPosition(this.editor.getPosition());

                    pushModal(ConfigureSceneObjectModal, {
                        variables: [variable],
                    });
                },
            });
        },

        methods: {
            ...mapActions(useProjectStore, ["addSceneObject"]),
        },
    });
</script>
