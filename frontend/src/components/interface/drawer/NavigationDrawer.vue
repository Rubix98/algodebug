<template>
    <v-navigation-drawer
        :rail="shouldShowRailVersion"
        :expand-on-hover="shouldShowRailVersion"
        :model-value="showDrawer"
        @update:modelValue="this.$emit('hideDrawerEvent')"
    >
        <v-list>
            <v-list-item :prepend-avatar="userAvatarImg" :title="userNameToShow" subtitle="" />
        </v-list>
        <v-divider />
        <NavigationDrawerButtons />
    </v-navigation-drawer>
</template>

<script>
    import { defineComponent } from "vue";
    import defaultUserImage from "@/img/user.png";
    import { mapState } from "pinia";
    import { useUserStore } from "@/stores/user";
    import NavigationDrawerButtons from "@/components/interface/drawer/NavigationDrawerButtons.vue";

    export default defineComponent({
        name: "NavigationDrawer",
        components: { NavigationDrawerButtons },

        emits: ["toggledToRailVersionEvent", "toggledToNormalVersionEvent", "hideDrawerEvent"],

        props: {
            showDrawer: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                shouldShowRailVersion: true,
            };
        },

        mounted() {
            this.updateDrawerVersion();
            addEventListener("resize", () => {
                this.updateDrawerVersion();
            });
        },

        methods: {
            updateDrawerVersion() {
                if (window.innerWidth >= 1280) {
                    this.$data.shouldShowRailVersion = true;
                    this.$emit("toggledToRailVersionEvent");
                } else {
                    this.$data.shouldShowRailVersion = false;
                    this.$emit("toggledToNormalVersionEvent");
                }
            },
        },

        computed: {
            ...mapState(useUserStore, ["userName", "loggedIn", "userPicture"]),

            userAvatarImg() {
                return this.userPicture === null ? defaultUserImage : this.userPicture;
            },

            userNameToShow() {
                return this.userName == null ? "Niezalogowany" : this.userName;
            },
        },
    });
</script>
