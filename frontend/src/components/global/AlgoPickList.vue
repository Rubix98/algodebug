<template>
    <v-list>
        <v-list-item
            v-for="(option, index) in options"
            :key="index"
            class="option"
            @click="(event) => selectOption(event, option)"
        >
            <a :href="option.href">
                <div v-if="option.dialogData">
                    <div
                        v-for="(property, index) in option.dialogData.properties"
                        :key="index"
                        v-show="property.value != null"
                    >
                        <v-list-item-title v-if="index === 0">
                            {{ property.value }}
                        </v-list-item-title>
                        <v-list-item-subtitle v-else>
                            {{ property.label }}:

                            <span v-if="property.fieldType === 'textarea'">
                                <AlgoTextarea class="small" :value="property.value" :readonly="true" />
                            </span>
                            <span v-else>
                                {{ property.value }}
                            </span>
                        </v-list-item-subtitle>
                    </div>
                </div>
                <v-list-item-title v-else>
                    {{ option.label }}
                </v-list-item-title>
            </a>
        </v-list-item>
        <div v-if="options == null || options.length === 0">Brak danych</div>
    </v-list>
</template>

<script>
    import AlgoTextarea from "@/components/global/AlgoTextarea.vue";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoTextarea },
        emits: ["selectOptionEvent"],
        props: ["options"],

        methods: {
            selectOption(event, selectedOption) {
                if (event.target.localName === "textarea") return;

                this.$emit("selectOptionEvent", selectedOption);
            },
        },
    });
</script>

<style>
    a {
        color: inherit;
        text-decoration: inherit;
    }
</style>
