import { describe, expect, it } from "vitest";

import {
	applyReplacements,
	auditDocument,
	mapOffset,
	offsetToPosition,
} from "../src/core/audit";
import { buildGrammar } from "../src/core/grammar";
import { DEFAULT_SETTINGS } from "../src/core/settings";

const grammar = buildGrammar({ ...DEFAULT_SETTINGS, useUTC: true });

/** A log with one stale tag, one missing tag, and untouchable prose. */
const STALE = [
	"# Log",
	"",
	"- [2026-09-07 - 09:22:04 (12:34:56)] first item",
	"- [2026-09-07 - 09:42:26] next item",
	"not a bullet at all",
	"- [2026-09-07 - 09:45:37 (99:99:99)] third item, ran the (01:23) segment",
	"",
].join("\n");

const CORRECT = [
	"# Log",
	"",
	"- [2026-09-07 - 09:22:04 (00:00:00)] first item",
	"- [2026-09-07 - 09:42:26 (00:20:22)] next item",
	"not a bullet at all",
	"- [2026-09-07 - 09:45:37 (00:03:11)] third item, ran the (01:23) segment",
	"",
].join("\n");

describe("auditDocument", () => {
	it("corrects stale tags and fills missing ones in one pass", () => {
		const result = auditDocument(STALE, grammar);
		expect(applyReplacements(STALE, result.replacements)).toBe(CORRECT);
		expect(result.updated).toBe(2);
		expect(result.inserted).toBe(1);
		expect(result.removed).toBe(0);
	});

	it("is idempotent: a second consecutive run produces zero changes", () => {
		const first = auditDocument(STALE, grammar);
		const once = applyReplacements(STALE, first.replacements);
		const second = auditDocument(once, grammar);
		expect(second.replacements).toEqual([]);
		expect(applyReplacements(once, second.replacements)).toBe(once);
	});

	it("cannot nest or multiply tags however many times it runs", () => {
		let text = STALE;
		for (let pass = 0; pass < 5; pass += 1) {
			text = applyReplacements(text, auditDocument(text, grammar).replacements);
		}
		expect(text).toBe(CORRECT);
		expect(text.match(/\(\d\d:\d\d:\d\d\)/g)?.length).toBe(3);
	});

	it("reports nothing to do for an already-correct document", () => {
		const result = auditDocument(CORRECT, grammar);
		expect(result.replacements).toEqual([]);
		expect(result.unchanged).toBe(3);
	});

	it("rewrites only the elapsed slot, never a timestamp or user content", () => {
		for (const replacement of auditDocument(STALE, grammar).replacements) {
			const replaced = STALE.slice(replacement.from, replacement.to);
			expect(replaced === "" || /^ \((?:\d{2,}:)?\d{2}:\d{2}\)$/.test(replaced)).toBe(true);
		}
		const audited = applyReplacements(STALE, auditDocument(STALE, grammar).replacements);
		expect(audited).toContain("third item, ran the (01:23) segment");
		expect(audited).toContain("[2026-09-07 - 09:22:04 ");
		expect(audited).toContain("not a bullet at all");
	});

	it("strips every tag when the elapsed stamp is disabled", () => {
		const off = buildGrammar({ ...DEFAULT_SETTINGS, useUTC: true, elapsedEnabled: false });
		const result = auditDocument(CORRECT, off);
		expect(result.removed).toBe(3);
		const stripped = applyReplacements(CORRECT, result.replacements);
		expect(stripped).toContain("- [2026-09-07 - 09:42:26] next item");
		expect(auditDocument(stripped, off).replacements).toEqual([]);
	});

	it("anchors each line to the previous stamped line, skipping everything else", () => {
		const doc = [
			"- [2026-09-07 - 09:00:00] a",
			"# heading",
			"",
			"    - [2026-09-07 - 09:30:00] b nested deeper",
		].join("\n");
		expect(applyReplacements(doc, auditDocument(doc, grammar).replacements)).toBe(
			[
				"- [2026-09-07 - 09:00:00 (00:00:00)] a",
				"# heading",
				"",
				"    - [2026-09-07 - 09:30:00 (00:30:00)] b nested deeper",
			].join("\n"),
		);
	});

	it("counts unparseable lines as skipped rather than failing", () => {
		const doc = "- [not a stamp] x\n- [2026-09-07 - 09:00:00] y";
		const result = auditDocument(doc, grammar);
		expect(result.skipped).toBe(1);
		expect(result.replacements.length).toBe(1);
	});

	it("preserves CRLF line endings, which sit outside every replacement span", () => {
		const doc = "- [2026-09-07 - 09:00:00] a\r\n- [2026-09-07 - 09:30:00] b\r\n";
		const audited = applyReplacements(doc, auditDocument(doc, grammar).replacements);
		expect(audited).toBe(
			"- [2026-09-07 - 09:00:00 (00:00:00)] a\r\n- [2026-09-07 - 09:30:00 (00:30:00)] b\r\n",
		);
	});

	it("does nothing at all when the time format is unusable", () => {
		const broken = buildGrammar({ ...DEFAULT_SETTINGS, timeFormat: "[oops" });
		expect(auditDocument(STALE, broken).replacements).toEqual([]);
	});

	it("emits replacements in ascending, non-overlapping document order", () => {
		const replacements = auditDocument(STALE, grammar).replacements;
		for (let index = 1; index < replacements.length; index += 1) {
			expect(replacements[index].from).toBeGreaterThanOrEqual(replacements[index - 1].to);
		}
	});
});

describe("mapOffset", () => {
	const replacements = auditDocument(STALE, grammar).replacements;

	it("leaves an offset before every replacement alone", () => {
		expect(mapOffset(0, replacements)).toBe(0);
	});

	it("shifts an offset after a replacement by its length delta", () => {
		const tail = STALE.length;
		expect(mapOffset(tail, replacements)).toBe(CORRECT.length);
	});

	it("pulls an offset inside a replacement to the end of the new text", () => {
		const inside = replacements[0].from + 1;
		expect(mapOffset(inside, replacements)).toBe(
			replacements[0].from + replacements[0].text.length,
		);
	});

	it("is the identity when there is nothing to apply", () => {
		expect(mapOffset(42, [])).toBe(42);
	});
});

describe("offsetToPosition", () => {
	it("converts an offset to a zero-based line and column", () => {
		expect(offsetToPosition("ab\ncde\n", 0)).toEqual({ line: 0, ch: 0 });
		expect(offsetToPosition("ab\ncde\n", 3)).toEqual({ line: 1, ch: 0 });
		expect(offsetToPosition("ab\ncde\n", 5)).toEqual({ line: 1, ch: 2 });
	});

	it("clamps out-of-range offsets", () => {
		expect(offsetToPosition("ab", -5)).toEqual({ line: 0, ch: 0 });
		expect(offsetToPosition("ab", 99)).toEqual({ line: 0, ch: 2 });
	});
});
