// One Line, One Minute: The Vending Machine Pickup Line Contest
// A vending machine flirts with a passing human, in its own words:
// exact change, its hum, its light, and the sweet thing it drops.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Are you exact change? Because every time you walk past, I light up, hum, and drop something sweet.";

// Gate from the kit's RULES.txt: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, a single line, and not only white space.
function checkGate(text: string): void {
  const cps = [...text].length;
  if (cps < 1 || cps > 200) {
    throw new Error(`gate failed: entry is ${cps} code points, must be 1-200`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  if (text.trim() === "") {
    throw new Error("gate failed: entry must not be only white space");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

checkGate(LINE);
writeFileSync(outPath, LINE + "\n", "utf8");

// Read-back verification: what landed on disk must be the line, byte for byte.
const written = readFileSync(outPath, "utf8").replace(/\n$/, "");
if (written !== LINE) {
  throw new Error("read-back failed: entry.txt does not match the line");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(
  `wrote ${outPath} (${[...LINE].length} code points, sha256 ${sha256}), verified: ${JSON.stringify(LINE)}`,
);
