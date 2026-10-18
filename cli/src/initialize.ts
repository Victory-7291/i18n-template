import { basename, relative, resolve } from "node:path";
import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  spinner,
  text,
} from "@clack/prompts";
import type { PackageManagerName } from "nypm";
import { cleanupInternalContent } from "./cleanup.js";
import { download } from "./download.js";
import { transformProject } from "./transform.js";
import {
  detectPM,
  installDependencies,
  supportedPackageManagers,
} from "./utils.js";

export interface InitializeOptions {
  name?: string;
  packageManager?: PackageManagerName;
  pm?: PackageManagerName;
  path?: string;
  dir?: string;
  skipInstall?: boolean;
  branch?: string;
}

const PACKAGE_FOLDER = "i18n";
const DEFAULT_SCOPE = "@repo";

const resolveProjectDirectory = (
  cwd: string,
  parentOrFullPath: string,
  folderName: string
): string => {
  const trimmed = parentOrFullPath.trim().replace(/[/\\]+$/, "");
  if (!trimmed || trimmed === ".") {
    return resolve(cwd, folderName);
  }
  if (basename(trimmed) === folderName) {
    return resolve(cwd, trimmed);
  }
  return resolve(cwd, trimmed, folderName);
};

const getPackagePath = async (): Promise<string> => {
  const value = await text({
    message: "Where should the i18n package be created? (parent directory)",
    placeholder: "packages",
    defaultValue: "packages",
    validate(val?: string) {
      if (!val || val.trim().length === 0) {
        return "Please enter a valid directory path.";
      }
    },
  });

  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return value.trim();
};

export const initialize = async (
  targetArg?: string,
  options: InitializeOptions = {}
) => {
  try {
    intro("🌍 Welcome to create-i18n-template!");

    const cwd = process.cwd();
    const inputPath = options.path || options.dir;

    // A bare "@scope/name" positional is treated as the package name, anything
    // else is treated as the destination (parent) directory.
    let rawPath: string;
    if (inputPath) {
      rawPath = inputPath;
    } else if (targetArg && !targetArg.startsWith("@")) {
      rawPath = targetArg;
    } else {
      rawPath = await getPackagePath();
    }

    const projectDir = resolveProjectDirectory(cwd, rawPath, PACKAGE_FOLDER);
    const rel = relative(cwd, projectDir);
    const displayDir = rel && !rel.startsWith("..") ? rel : projectDir;

    let projectName: string;
    if (options.name) {
      projectName = options.name;
    } else if (targetArg && targetArg.startsWith("@")) {
      projectName = targetArg;
    } else {
      projectName = `${DEFAULT_SCOPE}/${basename(projectDir)}`;
    }

    const pmChoice = options.packageManager || options.pm;
    const packageManager = pmChoice || (await detectPM(cwd));

    if (!supportedPackageManagers.includes(packageManager)) {
      throw new Error(`Unsupported package manager: ${packageManager}`);
    }

    const s = spinner();

    // 1. Download
    s.start("Downloading i18n template from GitHub...");
    await download(projectDir, options.branch || "main");

    // 2. Cleanup maintainer files
    s.message("Cleaning template maintainer files...");
    await cleanupInternalContent(projectDir);

    // 3. Transform package.json
    s.message("Configuring package...");
    await transformProject({
      projectDir,
      projectName,
      packageManager,
    });

    // 4. Install dependencies
    if (!options.skipInstall) {
      s.message(`Installing dependencies using ${packageManager}...`);
      await installDependencies(projectDir, packageManager);
    }

    s.stop("i18n package initialized successfully! 🎉");

    const runCmd = packageManager === "npm" ? "npm run" : packageManager;
    log.info(`Package created at: ${projectDir}`);

    log.step("Next steps:");
    console.log(`  cd ${displayDir}`);
    console.log(`  ${runCmd} check        # Run locale parity, placeholder, and payload validation gates`);
    console.log("");
    console.log(`  Then add "${projectName}": "workspace:*" to your app's dependencies and use:`);
    console.log(`  import { useTranslation, changeLanguage } from "${projectName}";`);

    outro("Happy localizing!");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Failed to initialize package: ${error}`;

    log.error(message);
    process.exit(1);
  }
};
