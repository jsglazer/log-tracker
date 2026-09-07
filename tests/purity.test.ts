import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The reviewer criteria, asserted mechanically rather than by inspection: the
 * core is obsidian-free, clock-free and filesystem-free, and the shell is the
 * only place any of that lives.
 */
const CORE = join(__dirname, "..", "src", "core");
const SRC = join(__dirname, "..", "src");

function coreFiles(): string[] {
	return readdirSync(CORE)
		.filter((name) => name.endsWith(".ts"))
		.map((name) => join(CORE, name));
}

function read(path: string): string {
	return readFileSync(path, "utf8");
}

/** Source with comments stripped, so prose about a rule cannot satisfy it. */
function code(path: string): string {
	return read(path)
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/^[ \t]*\/\/.*$/gm, "");
}

describe("pure core", () => {
	it("has files to check", () => {
		expect(coreFiles().length).toBeGreaterThan(5);
	});

	it("imports nothing from obsidian", () => {
		for (const file of coreFiles()) {
			expect(code(file), file).not.toMatch(/from\s+["']obsidian["']/);
			expect(code(file), file).not.toMatch(/require\(\s*["']obsidian["']\s*\)/);
		}
	});

	it("uses no filesystem or vault API", () => {
		for (const file of coreFiles()) {
			expect(code(file), file).not.toMatch(/from\s+["'](?:node:)?fs["']/);
			expect(code(file), file).not.toMatch(/vault\.adapter/);
			expect(code(file), file).not.toMatch(/\bwriteFileSync\b|\breadFileSync\b/);
		}
	});

	it("never reads the wall clock: every instant is injected", () => {
		for (const file of coreFiles()) {
			const source = code(file);
			expect(source, file).not.toMatch(/Date\.now\(/);
			expect(source, file).not.toMatch(/new Date\(/);
			// A bare `dayjs()` call with no argument would silently read "now".
			expect(source, file).not.toMatch(/\bdayjs\(\s*\)/);
			expect(source, file).not.toMatch(/dayjs\.utc\(\s*\)/);
		}
	});

	it("registers no timers anywhere in the plugin", () => {
		for (const name of readdirSync(SRC).filter((file) => file.endsWith(".ts"))) {
			expect(code(join(SRC, name)), name).not.toMatch(/setInterval|setTimeout|registerInterval/);
		}
		for (const file of coreFiles()) {
			expect(code(file), file).not.toMatch(/setInterval|setTimeout/);
		}
	});

	it("keeps the obsidian import confined to the shell", () => {
		const shell = readdirSync(SRC)
			.filter((name) => name.endsWith(".ts"))
			.filter((name) => /from\s+["']obsidian["']/.test(code(join(SRC, name))));
		expect(shell.sort()).toEqual(["main.ts", "settings-tab.ts"]);
	});

	it("edits the document through the public editor transaction, not the vault", () => {
		const main = code(join(SRC, "main.ts"));
		expect(main).toMatch(/editor\.transaction\(/);
		expect(main).not.toMatch(/vault\.(?:adapter|modify|process)/);
		// One changes array, built in one place: the audit is a single atomic edit.
		expect(main.match(/editor\.transaction\(/g)?.length).toBe(1);
	});
});
