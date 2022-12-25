<template>
    <v-list>
        <v-list-item
            v-for="(option, index) in options"
            :key="index"
            class="option"
            @click="(event) => selectOption(event, option)"
        >
            {{ option.label }}
            <div v-if="option.dialogData">
                <div
                    v-for="(property, index) in option.dialogData.properties"
                    :key="index"
                    v-show="property.value != null"
                >
                    <b>{{ property.label }}</b
                    >:

                    <span v-if="property.fieldType === 'textarea'">
                        <AlgoTextarea class="small" :value="property.value" :readonly="true" />
                    </span>
                    <span v-else>
                        {{ property.value }}
                    </span>
                </div>
            </div>
        </v-list-item>
    </v-list>

    <div v-if="options == null || options.length === 0">Brak danych</div>
</template>

<script>
import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
import { defineComponent } from "vue";

export default defineComponent({
    props: ["options"],
    emits: ["selectOptionEvent"],
    components: { AlgoTextarea },

    methods: {
        selectOption(event, selectedOption) {
            if (event.target.localName === "textarea") return;

            this.$emit("selectOptionEvent", selectedOption);
        },
    },
});
</script>
