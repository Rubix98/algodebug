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
                        <v-list-item-subtitle v-else-if="property.fieldType !== 'textarea'">
                            {{ property.label }}: {{ property.value }}
                        </v-list-item-subtitle>
                        <AlgoCode v-else :code="property.value" :language="property.language" class="code" />
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
    import AlgoCode from "@/components/global/AlgoCode.vue";
    import { defineComponent } from "vue";

    export default defineComponent({
        components: { AlgoCode },
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

<style scoped>
    .code {
        margin-top: 5px;
        margin-bottom: 30px;
    }
</style>
