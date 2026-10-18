import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PackageManagerName } from "nypm";

export interface TransformOptions {
  projectDir: string;
  projectName: string;
  packageManager: PackageManagerName;
}

export const transformProject = async ({
  projectDir,
  projectName,
  packageManager,
}: TransformOptions): Promise<void> => {
  const packageJsonPath = join(projectDir, "package.json");
  const packageJsonRaw = await readFile(packageJsonPath, "utf-8");
  const pkg = JSON.parse(packageJsonRaw);

  // Set package name & initial version
  pkg.name = projectName;
  pkg.version = "0.1.0";
  pkg.private = true;
  pkg.description =
    "Shared type-safe i18n package built on i18next with 40 locale dictionaries, validation gates, and RTL support";

  // Clean out template maintainer scripts and the tooling they depended on
  if (pkg.scripts) {
    delete pkg.scripts.changeset;
    delete pkg.scripts["version-packages"];
    delete pkg.scripts.release;
    delete pkg.scripts["build:cli"];
  }
  if (pkg.devDependencies) {
    delete pkg.devDependencies["@changesets/cli"];
  }

  // Update package manager field
  if (packageManager === "bun") {
    pkg.packageManager = "bun@1.3.5";
  } else if (packageManager === "pnpm") {
    pkg.packageManager = "pnpm@10.5.0";
  } else if (packageManager === "npm") {
    pkg.packageManager = "npm@10.8.0";
  } else if (packageManager === "yarn") {
    pkg.packageManager = "yarn@1.22.22";
  }

  // Write formatted package.json
  await writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
};
