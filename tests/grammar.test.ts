import { describe, expect, it } from "vitest";

import { buildGrammar, composeStamp, parseStampLine, renderStamp } from "../src/core/grammar";
import { DEFAULT_SETTINGS, type LogTrackerSettings } from "../src/core/settings";

const UTC: LogTrackerSettings = { ...DEFAULT_SETTINGS, useUTC: true };
const grammar = buildGrammar(UTC);

/** 2026-09-07 09:42:26 UTC. */
const NOW = Date.UTC(2026, 8, 7, 9, 42, 26);

describe("parseStampLine", () => {
	it("splits a stamped bullet into indent, marker, timestamp, slot and content", () => {
		const parsed = parseStampLine("- [2026-09-07 - 09:42:26 (00:20:22)] next item", grammar);
		expect(parsed).not.toBeNull();
		expect(parsed?.indent).toBe("");
		expect(parsed?.marker).toBe("- ");
		expect(parsed?.timestamp).toBe("2026-09-07 - 09:42:26");
		expect(parsed?.elapsed).toBe("00:20:22");
		expect(parsed?.rest).toBe(" next item");
	});

	it("reports slot offsets that cover exactly the elapsed tag", () => {
		const line = "- [2026-09-07 - 09:42:26 (00:20:22)] next item";
		const parsed = parseStampLine(line, grammar);
		expect(line.slice(parsed?.slotFrom, parsed?.slotTo)).toBe(" (00:20:22)");
	});

	it("reports an empty slot as a zero-width span at the right column", () => {
		const line = "- [2026-09-07 - 09:42:26] next item";
		const parsed = parseStampLine(line, grammar);
		expect(parsed?.elapsed).toBeNull();
		expect(parsed?.slotFrom).toBe(parsed?.slotTo);
		expect(line.slice(0, parsed?.slotFrom)).toBe("- [2026-09-07 - 09:42:26");
	});

	it("accepts any indent depth and list marker", () => {
		for (const line of [
			"\t\t- [2026-09-07 - 09:42:26 (00:00:00)] deep",
			"    * [2026-09-07 - 09:42:26 (00:00:00)] star",
			"+ [2026-09-07 - 09:42:26 (00:00:00)] plus",
			"3. [2026-09-07 - 09:42:26 (00:00:00)] numbered",
			"- [ ] [2026-09-07 - 09:42:26 (00:00:00)] task",
			"[2026-09-07 - 09:42:26 (00:00:00)] no marker at all",
		]) {
			expect(parseStampLine(line, grammar), line).not.toBeNull();
		}
	});

	it("accepts both elapsed widths, so a style change does not orphan a document", () => {
		expect(parseStampLine("- [2026-09-07 - 09:42:26 (20:22)] auto", grammar)?.elapsed).toBe("20:22");
		expect(parseStampLine("- [2026-09-07 - 09:42:26 (120:00:01)] long", grammar)?.elapsed).toBe(
			"120:00:01",
		);
	});

	it("rejects lines that are not stamped", () => {
		for (const line of [
			"",
			"# A heading",
			"- an ordinary bullet",
			"- (00:20:22) a bullet that only looks like a tag",
			"- [not a timestamp] text",
			"- [2026-09-07 - 09:42] truncated timestamp",
		]) {
			expect(parseStampLine(line, grammar), line).toBeNull();
		}
	});

	it("leaves a parenthesised time in the body outside the elapsed slot", () => {
		// The tag pattern is anchored between the timestamp and the suffix, so
		// prose like this can never be read as, or overwritten by, a tag.
		const parsed = parseStampLine("- [2026-09-07 - 09:42:26] ran the (01:23) segment", grammar);
		expect(parsed?.elapsed).toBeNull();
		expect(parsed?.rest).toBe(" ran the (01:23) segment");
	});

	it("does not treat a tag placed after the suffix as the elapsed slot", () => {
		const parsed = parseStampLine("- [2026-09-07 - 09:42:26] (00:20:22) text", grammar);
		expect(parsed?.elapsed).toBeNull();
	});

	it("returns null for every line when the format is unusable", () => {
		const broken = buildGrammar({ ...UTC, timeFormat: "[oops" });
		expect(parseStampLine("- [2026-09-07 - 09:42:26 (00:00:00)] x", broken)).toBeNull();
	});
});

describe("renderStamp", () => {
	it("renders the first entry with a zero elapsed tag", () => {
		expect(renderStamp(NOW, null, grammar)).toBe("[2026-09-07 - 09:42:26 (00:00:00)]");
	});

	it("renders elapsed against the preceding timestamp", () => {
		expect(renderStamp(NOW, "2026-09-07 - 09:22:04", grammar)).toBe(
			"[2026-09-07 - 09:42:26 (00:20:22)]",
		);
	});

	it("omits the slot entirely when the elapsed stamp is off", () => {
		const off = buildGrammar({ ...UTC, elapsedEnabled: false });
		expect(renderStamp(NOW, "2026-09-07 - 09:22:04", off)).toBe("[2026-09-07 - 09:42:26]");
	});

	it("honours a custom prefix and suffix without disturbing the grammar", () => {
		const custom = buildGrammar({ ...UTC, prefix: "((", suffix: "))" });
		const line = "- " + renderStamp(NOW, null, custom) + " text";
		expect(line).toBe("- ((2026-09-07 - 09:42:26 (00:00:00))) text");
		expect(parseStampLine(line, custom)?.timestamp).toBe("2026-09-07 - 09:42:26");
	});

	it("round-trips: what it renders, the grammar parses back", () => {
		const line = "- " + renderStamp(NOW, "2026-09-07 - 09:22:04", grammar) + " content";
		const parsed = parseStampLine(line, grammar);
		expect(parsed?.timestamp).toBe("2026-09-07 - 09:42:26");
		expect(parsed?.elapsed).toBe("00:20:22");
		expect(parsed?.rest).toBe(" content");
	});

	it("degrades to the raw format text instead of throwing on an unusable format", () => {
		const broken = buildGrammar({ ...UTC, timeFormat: "[oops" });
		expect(() => renderStamp(NOW, null, broken)).not.toThrow();
		expect(renderStamp(NOW, null, broken)).toBe("[[oops (00:00:00)]");
	});

	it("composeStamp is the single assembly point", () => {
		expect(composeStamp("T", "00:00:00", UTC)).toBe("[T (00:00:00)]");
		expect(composeStamp("T", null, UTC)).toBe("[T]");
	});
});
