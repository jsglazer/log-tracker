import { describe, expect, it } from "vitest";

import { elapsedBetween, elapsedMsBetween, formatElapsed, zeroElapsed } from "../src/core/elapsed";
import { compileFormat } from "../src/core/format";

const FULL = compileFormat("YYYY-MM-DD - HH:mm:ss", false);
const TIME_ONLY = compileFormat("HH:mm:ss", false);
const DATE_ONLY = compileFormat("YYYY-MM-DD", false);

describe("formatElapsed", () => {
	it("renders a standard interval", () => {
		expect(formatElapsed((20 * 60 + 22) * 1000, "hms")).toBe("00:20:22");
		expect(formatElapsed((3 * 3600 + 4 * 60 + 5) * 1000, "hms")).toBe("03:04:05");
	});

	it("keeps counting hours past a day rather than rolling over", () => {
		expect(formatElapsed((26 * 3600 + 1) * 1000, "hms")).toBe("26:00:01");
		expect(formatElapsed(100 * 3600 * 1000, "hms")).toBe("100:00:00");
	});

	it("drops the hours group under an hour in auto style only", () => {
		expect(formatElapsed(3 * 60 * 1000 + 11_000, "auto")).toBe("03:11");
		expect(formatElapsed(3 * 60 * 1000 + 11_000, "hms")).toBe("00:03:11");
		expect(formatElapsed(3_600_000, "auto")).toBe("01:00:00");
	});

	it("truncates sub-second remainders rather than rounding up", () => {
		expect(formatElapsed(1999, "hms")).toBe("00:00:01");
	});

	it("renders zero for zero, negative and non-finite spans", () => {
		expect(formatElapsed(0, "hms")).toBe("00:00:00");
		expect(formatElapsed(-5000, "hms")).toBe("00:00:00");
		expect(formatElapsed(Number.NaN, "hms")).toBe("00:00:00");
		expect(formatElapsed(Number.POSITIVE_INFINITY, "hms")).toBe("00:00:00");
		expect(formatElapsed(0, "auto")).toBe("00:00");
	});
});

describe("elapsedMsBetween", () => {
	it("measures a plain forward interval", () => {
		expect(
			elapsedMsBetween("2026-09-07 - 09:22:04", "2026-09-07 - 09:42:26", FULL, false),
		).toBe((20 * 60 + 22) * 1000);
	});

	it("measures across a real day boundary when the format carries a date", () => {
		expect(
			elapsedMsBetween("2026-09-07 - 23:50:00", "2026-09-08 - 00:10:00", FULL, false),
		).toBe(20 * 60 * 1000);
	});

	it("measures a multi-day gap without collapsing it", () => {
		expect(
			elapsedMsBetween("2026-09-05 - 09:00:00", "2026-09-07 - 09:00:00", FULL, false),
		).toBe(2 * 86_400_000);
	});

	it("returns zero for identical timestamps", () => {
		expect(elapsedMsBetween("2026-09-07 - 09:22:04", "2026-09-07 - 09:22:04", FULL, false)).toBe(0);
	});

	it("applies exactly one forward-progression correction when the date is missing", () => {
		// 23:50 -> 00:10 with no date: assume the log crossed midnight once.
		expect(elapsedMsBetween("23:50:00", "00:10:00", TIME_ONLY, false)).toBe(20 * 60 * 1000);
	});

	it("does not invent a rollover when a dated timestamp actually goes backwards", () => {
		// One +24h correction still leaves this negative, so there is no answer.
		expect(
			elapsedMsBetween("2026-09-09 - 09:00:00", "2026-09-07 - 09:00:00", FULL, false),
		).toBeNull();
	});

	it("returns null when the format carries no time of day", () => {
		expect(elapsedMsBetween("2026-09-05", "2026-09-07", DATE_ONLY, false)).toBeNull();
	});

	it("returns null for malformed timestamps instead of throwing", () => {
		expect(elapsedMsBetween("not a time", "2026-09-07 - 09:00:00", FULL, false)).toBeNull();
		expect(elapsedMsBetween("2026-09-07 - 09:00:00", "99:99:99", FULL, false)).toBeNull();
		expect(elapsedMsBetween("", "", FULL, false)).toBeNull();
	});

	it("returns null when the format itself is unusable", () => {
		expect(elapsedMsBetween("a", "b", compileFormat("[oops", false), false)).toBeNull();
	});

	it("never yields a negative or non-finite value", () => {
		const pairs: ReadonlyArray<readonly [string, string]> = [
			["2026-09-07 - 09:00:00", "2026-09-07 - 08:00:00"],
			["2026-09-07 - 00:00:00", "2026-09-07 - 00:00:00"],
			["2026-09-07 - 23:59:59", "2026-09-08 - 00:00:00"],
		];
		for (const [before, after] of pairs) {
			const ms = elapsedMsBetween(before, after, FULL, false);
			if (ms !== null) {
				expect(ms).toBeGreaterThanOrEqual(0);
				expect(Number.isFinite(ms)).toBe(true);
			}
		}
	});
});

describe("elapsedBetween", () => {
	it("renders zero for the first entry, which has no anchor", () => {
		expect(elapsedBetween(null, "2026-09-07 - 09:22:04", FULL, false, "hms")).toBe("00:00:00");
		expect(elapsedBetween(null, "2026-09-07 - 09:22:04", FULL, false, "auto")).toBe("00:00");
	});

	it("degrades to zero rather than throwing on unusable input", () => {
		expect(elapsedBetween("garbage", "2026-09-07 - 09:22:04", FULL, false, "hms")).toBe("00:00:00");
	});

	it("renders the worked example from the concept", () => {
		expect(
			elapsedBetween("2026-09-07 - 09:22:04", "2026-09-07 - 09:42:26", FULL, false, "hms"),
		).toBe("00:20:22");
		expect(
			elapsedBetween("2026-09-07 - 09:42:26", "2026-09-07 - 09:45:37", FULL, false, "hms"),
		).toBe("00:03:11");
	});

	it("agrees with zeroElapsed on the degraded value for each style", () => {
		expect(zeroElapsed("hms")).toBe("00:00:00");
		expect(zeroElapsed("auto")).toBe("00:00");
	});
});
