/**
 * Elapsed-time math between two timestamp strings.
 *
 * The contract is total: every path returns a well-formed elapsed string. There
 * is no negative result, no `NaN`, and no thrown exception -- a malformed
 * timestamp, an unusable format, or a comparison that cannot be made all
 * degrade to zero.
 */
import type { CompiledFormat } from "./format";
import type { ElapsedStyle } from "./settings";
import { dayjs, parseStamp } from "./time";

const MS_PER_DAY = 86_400_000;

/**
 * Matches the inside of an elapsed tag: an optional hours group of two or more
 * digits, then minutes and seconds. Both widths are accepted so a document
 * written under `hms` still reads correctly under `auto` and vice versa. This
 * pattern is only ever used anchored to the elapsed slot of the line grammar --
 * it is never searched free-floating in a line, so prose containing something
 * like `(01:23)` is never mistaken for a tag.
 */
export const ELAPSED_INNER = "(?:\\d{2,}:)?\\d{2}:\\d{2}";

function pad2(value: number): string {
	return value < 10 ? "0" + String(value) : String(value);
}

/** The zero value for a style: `00:00:00` under `hms`, `00:00` under `auto`. */
export function zeroElapsed(style: ElapsedStyle): string {
	return style === "auto" ? "00:00" : "00:00:00";
}

/**
 * Render a non-negative millisecond span. Sub-second remainders are truncated,
 * so a span is never rounded up past a boundary it did not reach.
 */
export function formatElapsed(ms: number, style: ElapsedStyle): string {
	if (!Number.isFinite(ms) || ms <= 0) {
		return zeroElapsed(style);
	}
	const span = dayjs.duration(Math.floor(ms / 1000) * 1000);
	const hours = Math.floor(span.asHours());
	const minutes = span.minutes();
	const seconds = span.seconds();
	if (style === "auto" && hours === 0) {
		return pad2(minutes) + ":" + pad2(seconds);
	}
	return pad2(hours) + ":" + pad2(minutes) + ":" + pad2(seconds);
}

/** Milliseconds since midnight of a parsed instant, ignoring its date. */
function timeOfDayMs(hour: number, minute: number, second: number, ms: number): number {
	return ((hour * 60 + minute) * 60 + second) * 1000 + ms;
}

/**
 * Milliseconds from `previous` to `current`, both written in `compiled.format`.
 *
 * Returns `null` when no meaningful comparison exists: an invalid format, a
 * format with no time-of-day component, a timestamp that fails strict parsing,
 * or a gap that stays negative after the single day-rollover correction.
 *
 * When the format carries no date, the comparison is made on time-of-day alone
 * rather than on the epoch values, because dayjs fills a missing date with the
 * current one -- reading the wall clock, and making the result depend on when
 * it ran. Time-of-day arithmetic keeps this function deterministic.
 */
export function elapsedMsBetween(
	previous: string,
	current: string,
	compiled: CompiledFormat,
	useUTC: boolean,
): number | null {
	if (!compiled.valid || !compiled.hasTime) {
		return null;
	}
	const before = parseStamp(previous, compiled.format, useUTC);
	const after = parseStamp(current, compiled.format, useUTC);
	if (!before.isValid() || !after.isValid()) {
		return null;
	}

	let delta = compiled.hasDate
		? after.valueOf() - before.valueOf()
		: timeOfDayMs(after.hour(), after.minute(), after.second(), after.millisecond()) -
			timeOfDayMs(before.hour(), before.minute(), before.second(), before.millisecond());

	if (delta < 0) {
		// Assume forward progression: exactly one day is added back. A gap that
		// is still negative afterwards is not a rollover, it is a timestamp
		// edited out of order, and it degrades to zero rather than guessing.
		delta += MS_PER_DAY;
	}
	if (delta < 0 || !Number.isFinite(delta)) {
		return null;
	}
	return delta;
}

/**
 * The elapsed tag text for a line whose timestamp is `current` and whose
 * nearest preceding stamp is `previous` (`null` when there is none). Always
 * returns a renderable value.
 */
export function elapsedBetween(
	previous: string | null,
	current: string,
	compiled: CompiledFormat,
	useUTC: boolean,
	style: ElapsedStyle,
): string {
	if (previous === null) {
		return zeroElapsed(style);
	}
	const ms = elapsedMsBetween(previous, current, compiled, useUTC);
	return ms === null ? zeroElapsed(style) : formatElapsed(ms, style);
}
