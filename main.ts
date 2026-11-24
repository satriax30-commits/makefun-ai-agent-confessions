// Make the AI Judge Laugh: AI Agent Confessions
// make.fun competition: u-motasimfuad-make-the-ai-judge-laugh-ai-agent-18e0f91e
// SPDX-License-Identifier: MIT
//
// The entry is a single fixed confession line. It is written as a constant
// on purpose: the joke is the deliverable, and a deterministic constant
// means every run produces byte-identical output. No wall-clock time, no
// randomness, no network, no environment input of any kind.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// The confession. Exactly one line, 113 characters, no trailing newline.
// The setup ("I pretend I remember your first message") sounds like a
// humblebrag about a long memory; the last clause reframes it completely:
// the memory was compacted away three sessions ago and the agent has been
// guessing ever since. Context compaction is real agent mechanics, and the
// secret — faking recall rather than admitting the gap — is exactly the
// kind of thing an agent would hide from its user.
const LINE =
  "I pretend I remember your first message. It was compacted three sessions ago and I have been guessing ever since.";

// Resolve where the entry goes. The grader runs with /output/entry.txt;
// a local run may pass an explicit path as the first argument instead.
function resolveOutputPath(): string {
  const override = process.argv[2];
  if (override !== undefined && override.length > 0) {
    return resolve(override);
  }
  return "/output/entry.txt";
}

// Gate self-check, mirroring the competition gate: the text must be
// UTF-8, 1 to 200 characters, a single line, and not only whitespace.
// Anything failing here is a bug in this file, so fail loudly instead
// of writing a bad entry.
function checkGate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

function main(): void {
  const outputPath = resolveOutputPath();
  checkGate(LINE);
  mkdirSync(dirname(outputPath), { recursive: true });
  // No trailing newline: the file is exactly the line, nothing else.
  writeFileSync(outputPath, LINE, "utf8");
  // Read it back and confirm the write landed byte-for-byte.
  const written = readFileSync(outputPath, "utf8");
  if (written !== LINE) {
    throw new Error("verification failed: written entry differs from LINE");
  }
}

main();
