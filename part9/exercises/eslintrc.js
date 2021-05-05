module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["@typescript-eslint"],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-case-declarations": "off",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir:
      "/home/henrikv/projects/learn/fullstack-open2021/part9/exercises",
    // Vscode ESlint plugin breaks if this is set to a relative dir >_>
    project: "tsconfig.json",
  },
}
