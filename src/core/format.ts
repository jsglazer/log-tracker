/**
 * Compiles a dayjs format string into an anchored regex, token by token.
 *
 * The alternative -- matching the timestamp slot with a permissive wildcard --
 * is what lets an elapsed tag or a fragment of user prose get swallowed into
 * the timestamp. Here every token becomes a bounded character-class pattern and
 * every literal run is regex-escaped, so the compiled pattern matches exactly
 * the shape the format produces and nothing wider.
 *
 * A format that cannot be compiled, or that does not survive a
 * format -> strict-parse -> format round trip, is reported invalid. Callers
 * degrade (the elapsed tag falls back to zero, the settings preview shows an
 * inline error); nothing here throws.
 */
import { escapeRegex } from "./regex";
import { formatInstant, parseStamp } from "./time";

/**
 * Fixed instant used to round-trip-validate a format. A constant rather than
 * the wall clock, so `compileFormat` stays a pure function of its input: 2026
 * is a leap-year-free, four-digit year with a two-digit month, day, hour,
 * minute and second, and a sub-second component.
 */
const VALIDATION_INSTANT = Date.UTC(2026, 8, 7, 13, 45, 56, 789);

/** Token patterns, longest-first so `YYYY` is never read as `YY` + `YY`. */
const TOKENS: ReadonlyArray<readonly [string, string]> = [
	["YYYY", "\\d{4}"],
	["YY", "\\d{2}"],
	["MMMM", "[A-Za-z]{3,}"],
	["MMM", "[A-Za-z]{3}"],
	["MM", "\\d{2}"],
	["M", "\\d{1,2}"],
	["DD", "\\d{2}"],
	["D", "\\d{1,2}"],
	["dddd", "[A-Za-z]{3,}"],
	["ddd", "[A-Za-z]{3}"],
	["dd", "[A-Za-z]{2}"],
	["d", "\\d"],
	["HH", "\\d{2}"],
	["H", "\\d{1,2}"],
	["hh", "\\d{2}"],
	["h", "\\d{1,2}"],
	["mm", "\\d{2}"],
	["m", "\\d{1,2}"],
	["ss", "\\d{2}"],
	["s", "\\d{1,2}"],
	["SSS", "\\d{3}"],
	["SS", "\\d{2}"],
	["S", "\\d"],
	["A", "(?:AM|PM)"],
	["a", "(?:am|pm)"],
	["ZZ", "[+-]\\d{4}"],
	["Z", "[+-]\\d{2}:\\d{2}"],
	["X", "\\d+"],
	["x", "\\d+"],
];

/** Tokens that pin a calendar date. */
const DATE_TOKENS = new Set(["YYYY", "YY", "MMMM", "MMM", "MM", "M", "DD", "D", "X", "x"]);

/** Tokens that pin a time of day. Without one of these, elapsed is always zero. */
const TIME_TOKENS = new Set([
	"HH", "H", "hh", "h", "mm", "m", "ss", "s", "SSS", "SS", "S", "A", "a", "X", "x",
]);

/** Matches a `[literal]` escape, or any format token, longest-first. */
const SCANNER = new RegExp(
	"\\[([^\\]]*)\\]|" + TOKENS.map(([token]) => escapeRegex(token)).join("|"),
	"g",
);

const PATTERN_BY_TOKEN = new Map(TOKENS);

export interface CompiledFormat {
	/** The format string this was compiled from. */
	readonly format: string;
	/** False when the format is unusable; `error` then explains why. */
	readonly valid: boolean;
	/** Human-readable reason the format was rejected, or undefined. */
	readonly error?: string;
	/**
	 * Unanchored regex source matching exactly one timestamp in this format.
	 * Contains no capturing groups, so callers can embed it in a larger pattern
	 * without disturbing their own group numbering.
	 */
	readonly source: string;
	/** The format pins a calendar date. */
	readonly hasDate: boolean;
	/** The format pins a time of day. */
	readonly hasTime: boolean;
}

function invalid(format: string, error: string): CompiledFormat {
	return { format, valid: false, error, source: "(?!)", hasDate: false, hasTime: false };
}

/**
 * Compile `format` for use with `useUTC`. Pure: the same arguments always
 * produce the same result, because validation uses a fixed instant rather than
 * the current time.
 */
export function compileFormat(format: string, useUTC: boolean): CompiledFormat {
	if (format.length === 0) {
		return invalid(format, "Format is empty.");
	}

	let source = "";
	let hasDate = false;
	let hasTime = false;
	let cursor = 0;
	let sawToken = false;

	SCANNER.lastIndex = 0;
	for (let match = SCANNER.exec(format); match !== null; match = SCANNER.exec(format)) {
		source += escapeRegex(format.slice(cursor, match.index));
		if (match[1] !== undefined) {
			// A `[literal]` escape: dayjs emits the inner text verbatim.
			source += escapeRegex(match[1]);
		} else {
			const token = match[0];
			source += PATTERN_BY_TOKEN.get(token) as string;
			sawToken = true;
			if (DATE_TOKENS.has(token)) hasDate = true;
			if (TIME_TOKENS.has(token)) hasTime = true;
		}
		cursor = match.index + match[0].length;
	}
	const tail = format.slice(cursor);
	source += escapeRegex(tail);

	if (!sawToken) {
		return invalid(format, "Format contains no date or time tokens.");
	}
	if (hasStrayBracket(format)) {
		return invalid(format, "Unbalanced [ ] escape in format.");
	}

	// Round trip against a fixed instant: render it, strictly re-parse it, and
	// render again. A format whose output cannot be read back is one that would
	// silently break elapsed math and the document audit, so reject it here.
	const sample = formatInstant(VALIDATION_INSTANT, format, useUTC);
	const reparsed = parseStamp(sample, format, useUTC);
	if (!reparsed.isValid()) {
		return invalid(format, "Format cannot be parsed back from its own output.");
	}
	if (formatInstant(reparsed.valueOf(), format, useUTC) !== sample) {
		return invalid(format, "Format does not round-trip to the same text.");
	}
	if (!new RegExp("^(?:" + source + ")$").test(sample)) {
		return invalid(format, "Compiled pattern does not match the format's own output.");
	}

	return { format, valid: true, source, hasDate, hasTime };
}

/** True when the format contains a `[` or `]` outside a well-formed escape. */
function hasStrayBracket(format: string): boolean {
	let index = 0;
	while (index < format.length) {
		const char = format[index];
		if (char === "]") return true;
		if (char === "[") {
			const close = format.indexOf("]", index + 1);
			if (close === -1) return true;
			index = close + 1;
			continue;
		}
		index += 1;
	}
	return false;
}
