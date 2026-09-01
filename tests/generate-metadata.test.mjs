import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createStableMetadata, versionFromSourceTag } from "../scripts/generate-metadata.mjs";

describe("fork updater metadata", () => {
  it("describes the public Windows x64 installer for a private source tag", () => {
    const metadata = createStableMetadata({
      artifactName: "open-design-antigravity-0.15.2-win-x64-setup.exe",
      artifactSize: 321_654_987,
      generatedAt: "2026-07-16T20:00:00.000Z",
      repository: "klismam777/open-design-antigravity-releases",
      sourceTag: "antigravity-v0.15.2",
    });

    assert.equal(metadata.version, 1);
    assert.equal(metadata.channel, "stable");
    assert.equal(metadata.baseVersion, "0.15.2");
    assert.equal(metadata.releaseVersion, "0.15.2");
    assert.equal(metadata.stableVersion, "0.15.2");
    assert.equal(metadata.generatedAt, "2026-07-16T20:00:00.000Z");
    assert.deepEqual(metadata.platforms.win, {
      arch: "x64",
      artifacts: {
        installer: {
          contentType: "application/vnd.microsoft.portable-executable",
          name: "open-design-antigravity-0.15.2-win-x64-setup.exe",
          sha256Url:
            "https://github.com/klismam777/open-design-antigravity-releases/releases/download/v0.15.2/open-design-antigravity-0.15.2-win-x64-setup.exe.sha256",
          size: 321_654_987,
          url:
            "https://github.com/klismam777/open-design-antigravity-releases/releases/download/v0.15.2/open-design-antigravity-0.15.2-win-x64-setup.exe",
        },
      },
      channel: "stable",
      enabled: true,
      feed: null,
      label: "Windows x64",
      platform: "win",
      platformKey: "win",
      signed: false,
    });
  });

  it("describes the public macOS Apple Silicon DMG for a private source tag", () => {
    const metadata = createStableMetadata({
      artifactName: "open-design-antigravity-0.15.2-mac-arm64.dmg",
      artifactSize: 250_000_000,
      generatedAt: "2026-07-16T20:00:00.000Z",
      repository: "klismam777/open-design-antigravity-releases",
      sourceTag: "antigravity-v0.15.2",
    });

    assert.equal(metadata.version, 1);
    assert.equal(metadata.channel, "stable");
    assert.equal(metadata.baseVersion, "0.15.2");
    assert.equal(metadata.releaseVersion, "0.15.2");
    assert.equal(metadata.stableVersion, "0.15.2");
    assert.deepEqual(metadata.platforms.mac, {
      arch: "arm64",
      artifacts: {
        dmg: {
          contentType: "application/x-apple-diskimage",
          name: "open-design-antigravity-0.15.2-mac-arm64.dmg",
          sha256Url:
            "https://github.com/klismam777/open-design-antigravity-releases/releases/download/v0.15.2/open-design-antigravity-0.15.2-mac-arm64.dmg.sha256",
          size: 250_000_000,
          url:
            "https://github.com/klismam777/open-design-antigravity-releases/releases/download/v0.15.2/open-design-antigravity-0.15.2-mac-arm64.dmg",
        },
        installer: {
          contentType: "application/x-apple-diskimage",
          name: "open-design-antigravity-0.15.2-mac-arm64.dmg",
          sha256Url:
            "https://github.com/klismam777/open-design-antigravity-releases/releases/download/v0.15.2/open-design-antigravity-0.15.2-mac-arm64.dmg.sha256",
          size: 250_000_000,
          url:
            "https://github.com/klismam777/open-design-antigravity-releases/releases/download/v0.15.2/open-design-antigravity-0.15.2-mac-arm64.dmg",
        },
      },
      channel: "stable",
      enabled: true,
      feed: null,
      label: "macOS Apple Silicon",
      platform: "mac",
      platformKey: "mac",
      signed: false,
    });
  });

  it("rejects source tags outside the Antigravity release namespace", () => {
    assert.throws(() => versionFromSourceTag("v0.15.2"), /invalid source tag/);
    assert.throws(() => versionFromSourceTag("antigravity-v0.15.2-beta.1"), /invalid source tag/);
    assert.throws(() => versionFromSourceTag("antigravity-v0.15"), /invalid source tag/);
  });
});
