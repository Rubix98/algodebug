<template>
    <div class="algo-block">
        <v-card>
            <v-card-title>
                {{ header }}
            </v-card-title>
            <v-divider />
            <v-card-text class="content">
                <slot></slot>
            </v-card-text>
        </v-card>
        <!--        <div class="header flex-vertical-space-between">-->
        <!--            <div><slot name="checkbox"></slot></div>-->
        <!--        </div>-->

        <!--        <div class="content">-->
        <!--        </div>-->
    </div>
</template>

<script>
export default {
    props: ["header"],
};
</script>

<style scoped>
.algo-block {
    margin: 5px;
    padding: 0;
}
</style>
