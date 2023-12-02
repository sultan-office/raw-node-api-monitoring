module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "es6",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-var": "error",
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all",
        tabWidth: 12,
        semi: false,
        singleQuote: true,
        bracketSpacing: true,
        eslintIntegration: true,
        printWidth: 120,
      },
    ],
  },
  plugins: ["prettier"],
};
