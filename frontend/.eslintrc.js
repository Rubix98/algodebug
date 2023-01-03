module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:vue/essential"],
    parserOptions: {
        parser: "@babel/eslint-parser",
        ecmaVersion: "latest",
        sourceType: "module",
    },
    ignorePatterns: ["dist/", "node_modules/"],
    plugins: ["vue"],
    rules: {
        "vue/order-in-components": [
            "error",
            {
                order: [
                    "name",
                    "components",
                    "emits",
                    "props",
                    "data",
                    [
                        "mounted",
                        "beforeMount",
                        "updated",
                        "beforeUpdate",
                        "created",
                        "beforeCreate",
                        "unmounted",
                        "beforeUnmounted",
                    ],
                    "methods",
                    "computed",
                    "watch",
                ],
            },
        ],
        "vue/no-v-model-argument": "off",
    },
};
