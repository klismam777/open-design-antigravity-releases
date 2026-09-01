import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/publish-windows.yml", import.meta.url), "utf8");

describe("Windows release workflow", () => {
  it("treats a missing first release as normal control flow", () => {
    assert.doesNotMatch(workflow, /gh release view/);
    assert.match(workflow, /Invoke-RestMethod/);
    assert.match(workflow, /exists=/);
  });

  it("targets the public repository without relying on the working directory", () => {
    assert.match(
      workflow,
      /gh release upload \$env:RELEASE_TAG \$assets --clobber --repo \$env:GITHUB_REPOSITORY/,
    );
    assert.match(
      workflow,
      /gh release edit \$env:RELEASE_TAG --latest --repo \$env:GITHUB_REPOSITORY/,
    );
  });
});

const macWorkflow = readFileSync(new URL("../.github/workflows/publish-mac.yml", import.meta.url), "utf8");

describe("macOS Apple Silicon release workflow", () => {
  it("targets the public repository with gh release and portable dmg build", () => {
    assert.match(macWorkflow, /gh release upload "\$RELEASE_TAG" "\$\{assets\[@\]\}" --clobber --repo "\$GITHUB_REPOSITORY"/);
    assert.match(macWorkflow, /gh release edit "\$RELEASE_TAG" --latest --repo "\$GITHUB_REPOSITORY"/);
    assert.match(macWorkflow, /gh release create "\$RELEASE_TAG" "\$\{assets\[@\]\}"/);
    assert.match(macWorkflow, /tools-pack mac build/);
    assert.match(macWorkflow, /--to dmg/);
  });
});


