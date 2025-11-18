module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // documentation only changes
        "style", // formatting, missing semi colons, etc; no production code change
        "refactor", // refactoring production code, eg. renaming a variable
        "test", // adding missing tests, refactoring tests; no production code change
        "chore", // updating build tasks, package manager configs, etc; no production code change
      ],
    ],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
  },
};
