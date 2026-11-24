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

// Gate self-check, mirroring the competition gate: the text must be
// UTF-8, 1 to 200 characters, a single line, and not only whitespace.
// It additionally rejects non-ASCII and control characters (the entry
// is plain ASCII English) and verifies the UTF-8 byte length equals the
// character count, so a stray multi-byte character can never slip in
// and change the byte length of the output file.
// Anything failing here is a bug in this file, so fail loudly instead
// of writing a bad entry.
function validateLine(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 127) {
      throw new Error(
        `entry must be ASCII only, got non-ASCII code ${code} at index ${i}`,
      );
    }
    if (code < 32 || code === 127) {
      throw new Error(
        `entry must not contain control characters, got code ${code} at index ${i}`,
      );
    }
  }
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength !== text.length) {
    throw new Error(
      `entry UTF-8 byte length ${byteLength} differs from character count ${text.length}`,
    );
  }
}

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
// Passing --help (or -h) prints usage and exits without writing anything.
function resolveOutputPath(): string {
  const override = process.argv[2];
  if (override === "--help" || override === "-h") {
    console.log(
      "Usage: main.ts [output-path]\n" +
        "Writes the single-line confession entry to /output/entry.txt\n" +
        "by default, or to the given path. No trailing newline.",
    );
    process.exit(0);
  }
  if (override !== undefined && override.length > 0) {
    return resolve(override);
  }
  return "/output/entry.txt";
}

// Re-read the written file and confirm it landed byte-for-byte, naming
// the rule that failed so a bad write is diagnosable, not silent.
function verifyWritten(outputPath: string, expected: string): void {
  const written = readFileSync(outputPath, "utf8");
  if (written !== expected) {
    throw new Error(
      `verification failed: ${outputPath} differs from LINE ` +
        `(wrote ${written.length} chars, expected ${expected.length})`,
    );
  }
}

function main(): void {
  const outputPath = resolveOutputPath();
  validateLine(LINE);
  mkdirSync(dirname(outputPath), { recursive: true });
  // No trailing newline: the file is exactly the line, nothing else.
  writeFileSync(outputPath, LINE, "utf8");
  verifyWritten(outputPath, LINE);
}

main();
