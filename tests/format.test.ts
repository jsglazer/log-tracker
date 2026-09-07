import { describe, expect, it } from "vitest";

import { compileFormat } from "../src/core/format";

describe("compileFormat", () => {
	it("compiles the default format into an anchored, bounded pattern", () => {
		const compiled = compileFormat("YYYY-MM-DD - HH:mm:ss", true);
		expect(compiled.valid).toBe(true);
		expect(compiled.hasDate).toBe(true);
		expect(compiled.hasTime).toBe(true);

		const re = new RegExp("^(?:" + compiled.source + ")$");
		expect(re.test("2026-09-07 - 09:22:04")).toBe(true);
		expect(re.test("2026-09-07 - 09:22")).toBe(false);
		expect(re.test("2026-09-07 - 09:22:04 (00:20:22)")).toBe(false);
	});

	it("reports a time-only format as having no date", () => {
		const compiled = compileFormat("HH:mm:ss", true);
		expect(compiled.valid).toBe(true);
		expect(compiled.hasDate).toBe(false);
		expect(compiled.hasTime).toBe(true);
	});

	it("reports a date-only format as having no time", () => {
		const compiled = compileFormat("YYYY-MM-DD", true);
		expect(compiled.valid).toBe(true);
		expect(compiled.hasDate).toBe(true);
		expect(compiled.hasTime).toBe(false);
	});

	it("emits no capturing groups, so callers can embed the pattern safely", () => {
		const compiled = compileFormat("YYYY-MM-DD - HH:mm:ss", true);
		const match = new RegExp("^(" + compiled.source + ")$").exec("2026-09-07 - 09:22:04");
		expect(match).not.toBeNull();
		expect((match as RegExpExecArray).length).toBe(2);
	});

	it("treats [bracketed] runs as literal text rather than tokens", () => {
		const compiled = compileFormat("[at] HH:mm:ss", true);
		expect(compiled.valid).toBe(true);
		expect(new RegExp("^(?:" + compiled.source + ")$").test("at 09:22:04")).toBe(true);
		expect(new RegExp("^(?:" + compiled.source + ")$").test("09:22:04")).toBe(false);
	});

	it("escapes regex metacharacters that appear as literals in the format", () => {
		const compiled = compileFormat("HH.mm.ss", true);
		expect(compiled.valid).toBe(true);
		const re = new RegExp("^(?:" + compiled.source + ")$");
		expect(re.test("09.22.04")).toBe(true);
		expect(re.test("09x22x04")).toBe(false);
	});

	it("rejects an empty format", () => {
		const compiled = compileFormat("", true);
		expect(compiled.valid).toBe(false);
		expect(compiled.error).toBeTruthy();
	});

	it("rejects an unbalanced bracket escape", () => {
		expect(compileFormat("[at HH:mm", true).valid).toBe(false);
		expect(compileFormat("HH:mm]", true).valid).toBe(false);
	});

	it("rejects a format with no date or time tokens", () => {
		expect(compileFormat("-----", true).valid).toBe(false);
	});

	it("never throws, whatever the input", () => {
		for (const format of ["", "[[[", "]]]", "\\", "(((", "YYYY", "?*+"]) {
			expect(() => compileFormat(format, false)).not.toThrow();
		}
	});

	it("is pure: repeated calls agree", () => {
		expect(compileFormat("YYYY-MM-DD - HH:mm:ss", false)).toEqual(
			compileFormat("YYYY-MM-DD - HH:mm:ss", false),
		);
	});
});
