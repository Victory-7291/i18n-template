import { type Command, program } from "commander";
import { initialize } from "./initialize.js";

const withSharedOptions = (command: Command): Command =>
  command
    .argument("[target]", "Parent directory path, or a scoped package name (e.g. @repo/i18n)")
    .option("-n, --name <name>", "Package name (default: @repo/<folder>)")
    .option("-p, --path <path>", "Parent directory where the i18n package is created")
    .option("-d, --dir <dir>", "Alias for --path")
    .option(
      "--pm, --package-manager <manager>",
      "Package manager to use (bun, pnpm, npm, yarn)"
    )
    .option("--skip-install", "Skip automatic dependency installation")
    .option("--branch <branch>", "Git branch or tag to download (default: main)")
    .action((target, options) => {
      initialize(target, options);
    });

withSharedOptions(
  program
    .name("create-i18n-template")
    .description(
      "Official CLI to add a type-safe i18n package (i18next + react-i18next, 40 locales, validation gates, RTL) to an existing project"
    )
);

withSharedOptions(
  program
    .command("init")
    .description("Add the i18n package to the current project (alias to root command)")
);

program.parse(process.argv);
