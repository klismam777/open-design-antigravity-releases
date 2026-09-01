import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SOURCE_TAG_PATTERN = /^antigravity-v(\d+\.\d+\.\d+)$/;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function versionFromSourceTag(sourceTag) {
  const match = SOURCE_TAG_PATTERN.exec(sourceTag);
  if (match?.[1] == null) {
    throw new Error(`invalid source tag: ${sourceTag}`);
  }
  return match[1];
}

export function createStableMetadata({
  artifactName,
  artifactSize,
  generatedAt = new Date().toISOString(),
  platform = artifactName?.endsWith(".dmg") || artifactName?.endsWith(".zip") ? "mac" : "win",
  repository,
  sourceTag,
}) {
  if (!REPOSITORY_PATTERN.test(repository)) {
    throw new Error(`invalid repository: ${repository}`);
  }
  if (typeof artifactName !== "string" || artifactName.length === 0 || artifactName.includes("/") || artifactName.includes("\\")) {
    throw new Error(`invalid artifact name: ${artifactName}`);
  }
  if (!Number.isSafeInteger(artifactSize) || artifactSize <= 0) {
    throw new Error(`invalid artifact size: ${artifactSize}`);
  }

  const releaseVersion = versionFromSourceTag(sourceTag);
  const releaseTag = `v${releaseVersion}`;
  const releaseBaseUrl = `https://github.com/${repository}/releases/download/${releaseTag}`;
  const artifactUrl = `${releaseBaseUrl}/${encodeURIComponent(artifactName)}`;

  const platforms = {};
  if (platform === "mac" || artifactName.endsWith(".dmg") || artifactName.endsWith(".zip")) {
    const isDmg = artifactName.endsWith(".dmg");
    const contentType = isDmg ? "application/x-apple-diskimage" : "application/zip";
    const artifactEntry = {
      contentType,
      name: artifactName,
      sha256Url: `${artifactUrl}.sha256`,
      size: artifactSize,
      url: artifactUrl,
    };
    platforms.mac = {
      arch: "arm64",
      artifacts: {
        dmg: artifactEntry,
        installer: artifactEntry,
      },
      channel: "stable",
      enabled: true,
      feed: null,
      label: "macOS Apple Silicon",
      platform: "mac",
      platformKey: "mac",
      signed: false,
    };
  } else {
    platforms.win = {
      arch: "x64",
      artifacts: {
        installer: {
          contentType: "application/vnd.microsoft.portable-executable",
          name: artifactName,
          sha256Url: `${artifactUrl}.sha256`,
          size: artifactSize,
          url: artifactUrl,
        },
      },
      channel: "stable",
      enabled: true,
      feed: null,
      label: "Windows x64",
      platform: "win",
      platformKey: "win",
      signed: false,
    };
  }

  return {
    baseVersion: releaseVersion,
    channel: "stable",
    generatedAt,
    platforms,
    releaseVersion,
    stableVersion: releaseVersion,
    version: 1,
  };
}

function parseArguments(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag == null || !flag.startsWith("--") || value == null) {
      throw new Error("usage: generate-metadata --source-tag TAG --repository OWNER/REPO --artifact PATH --output PATH");
    }
    values.set(flag.slice(2), value);
  }
  for (const required of ["source-tag", "repository", "artifact", "output"]) {
    if (!values.has(required)) throw new Error(`missing --${required}`);
  }
  return Object.fromEntries(values);
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const artifactPath = resolve(args.artifact);
  const outputPath = resolve(args.output);
  const artifact = await stat(artifactPath);
  if (!artifact.isFile() || artifact.size <= 0) {
    throw new Error(`artifact must be a non-empty file: ${artifactPath}`);
  }
  const metadata = createStableMetadata({
    artifactName: artifactPath.split(/[\\/]/).at(-1),
    artifactSize: artifact.size,
    repository: args.repository,
    sourceTag: args["source-tag"],
  });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  process.stdout.write(`${outputPath}\n`);
}

if (process.argv[1] != null && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
