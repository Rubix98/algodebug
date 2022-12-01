<template>
    <div>
        <div
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
        </div>
    </div>

    <div v-if="options == null || options.length === 0">Brak danych</div>
</template>

<script>
import AlgoTextarea from "@/components/global/AlgoTextarea.vue";

export default {
    props: ["options"],
    emits: ["selectOptionEvent"],
    components: { AlgoTextarea },

    methods: {
        selectOption(event, selectedOption) {
            if (event.target.localName === "textarea") return;

            this.$emit("selectOptionEvent", selectedOption);
        },
    },
};
</script>

<style scoped>
.option {
    width: 100%;
    border: 1px solid black;
    border-radius: 5px;
    margin: 5px 0;
    padding: 5px 10px;
    cursor: pointer;
}

.option:hover {
    background-color: #eee;
}
</style>
