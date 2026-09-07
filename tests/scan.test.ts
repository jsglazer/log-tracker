import { describe, expect, it } from "vitest";

import { buildGrammar } from "../src/core/grammar";
import { findPreviousTimestamp } from "../src/core/scan";
import { DEFAULT_SETTINGS } from "../src/core/settings";

const grammar = buildGrammar({ ...DEFAULT_SETTINGS, useUTC: true });

const DOC = [
	"# Morning log", // 0
	"", // 1
	"- [2026-09-07 - 09:22:04 (00:00:00)] first item", // 2
	"  some free prose that is not a bullet", // 3
	"- an ordinary bullet with no stamp", // 4
	"\t- [2026-09-07 - 09:42:26 (00:20:22)] nested item", // 5
	"", // 6
	"## Afternoon", // 7
	"- [2026-09-07 - 09:45:37 (00:03:11)] third item", // 8
	"- trailing bullet", // 9
];

describe("findPreviousTimestamp", () => {
	it("returns null above the first stamped line, so the first entry reads zero", () => {
		expect(findPreviousTimestamp(DOC, 0, grammar)).toBeNull();
		expect(findPreviousTimestamp(DOC, 2, grammar)).toBeNull();
	});

	it("skips prose and unstamped bullets to reach the nearest stamped line", () => {
		expect(findPreviousTimestamp(DOC, 5, grammar)).toBe("2026-09-07 - 09:22:04");
	});

	it("finds an anchor at a different indent depth", () => {
		// The line above is nested one tab deeper; depth is not a barrier.
		expect(findPreviousTimestamp(DOC, 8, grammar)).toBe("2026-09-07 - 09:42:26");
	});

	it("treats headings and blank lines as skippable, not as barriers", () => {
		expect(findPreviousTimestamp(DOC, 9, grammar)).toBe("2026-09-07 - 09:45:37");
	});

	it("never examines the line it is asked to look above", () => {
		expect(findPreviousTimestamp(DOC, 3, grammar)).toBe("2026-09-07 - 09:22:04");
		expect(findPreviousTimestamp(["- [2026-09-07 - 09:22:04 (00:00:00)] only"], 0, grammar)).toBeNull();
	});

	it("returns null for an empty document and clamps an out-of-range index", () => {
		expect(findPreviousTimestamp([], 0, grammar)).toBeNull();
		expect(findPreviousTimestamp(DOC, 999, grammar)).toBe("2026-09-07 - 09:45:37");
	});

	it("returns null when no line in the document is stamped", () => {
		expect(findPreviousTimestamp(["# only", "- prose", ""], 3, grammar)).toBeNull();
	});
});
