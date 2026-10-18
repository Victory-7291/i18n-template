import { rm } from "node:fs/promises";
import { join } from "node:path";

// The template is only ever consumed as a package inside an existing
// repository, so repo-level maintainer tooling (CLI source, changesets,
// GitHub workflows) has no meaning in the generated folder.
export const internalDirectories = ["cli", ".changeset", ".github"];

export const internalFiles = ["CHANGELOG.md", "tsconfig.tsbuildinfo"];

export const cleanupInternalContent = async (projectDir: string): Promise<void> => {
  for (const dir of internalDirectories) {
    await rm(join(projectDir, dir), { recursive: true, force: true });
  }

  for (const file of internalFiles) {
    await rm(join(projectDir, file), { force: true });
  }
};
