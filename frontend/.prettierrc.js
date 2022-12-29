// Config options: https://prettier.io/docs/en/options.html
// Config file: https://prettier.io/docs/en/configuration.html
// You can exclude files/folders from formatting by adding them to .prettierignore
module.exports = {
    useTabs: false,
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    printWidth: 120,
    overrides: [
        {
            files: ["*.vue"],
            options: {
                vueIndentScriptAndStyle: true,
                parser: "vue",
                proseWrap: "always",
            },
        },
    ],
};
