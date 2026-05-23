import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const roots = ["src", "tests", "scripts"];
const files = [];

async function collectJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectJsFiles(path);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(path);
    }
  }
}

for (const root of roots) {
  await collectJsFiles(root);
}

let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8"
  });

  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Syntax OK (${files.length} files)`);
