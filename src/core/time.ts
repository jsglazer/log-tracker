/**
 * The single dayjs entry point for the whole plugin.
 *
 * dayjs is imported directly here rather than reaching for `moment` off the
 * `obsidian` global, which would break the pure-core rule. No function in this
 * file (or anywhere under `src/core/`) reads the wall clock: `Date.now()`,
 * `new Date()` and bare `dayjs()` are all absent by design, and every caller
 * that needs "now" is handed it explicitly.
 */
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(utc);

export { dayjs };
export type { Dayjs };

/** Render an explicit instant with `format`, in UTC or the local zone. */
export function formatInstant(instant: number, format: string, useUTC: boolean): string {
	const d = useUTC ? dayjs.utc(instant) : dayjs(instant);
	return d.format(format);
}

/**
 * Strictly re-parse a timestamp string with `format`. Strict mode means a
 * string that does not match the format exactly yields an invalid Dayjs rather
 * than a silently coerced one; callers check `isValid()` and degrade.
 */
export function parseStamp(text: string, format: string, useUTC: boolean): Dayjs {
	return useUTC
		? dayjs.utc(text, format, true)
		: dayjs(text, format, true);
}
