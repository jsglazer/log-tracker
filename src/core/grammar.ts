/**
 * The one canonical line grammar, and the only place a stamped line is read or
 * written.
 *
 * A stamped line is exactly:
 *
 *     indent, list marker, prefix, timestamp, one space, (elapsed), suffix, content
 *
 * The elapsed tag lives in a fixed slot between the timestamp and the suffix
 * and is matched only there. It is never searched for free-floating in the
 * line, which is what makes the audit idempotent: body text containing
 * something like `(01:23)` sits after the suffix and is invisible to the
 * pattern, so a second pass cannot nest a tag inside a tag or rewrite prose.
 */
import { ELAPSED_INNER, elapsedBetween, zeroElapsed } from "./elapsed";
import { compileFormat, type CompiledFormat } from "./format";
import { escapeRegex } from "./regex";
import type { LogTrackerSettings } from "./settings";
import { formatInstant } from "./time";

/** Bullet, numbered, or task list marker, plus its trailing whitespace. */
const LIST_MARKER = "(?:[-*+]|\\d+[.)])[ \\t]+(?:\\[[ xX]\\][ \\t]+)?";

export interface Grammar {
	readonly settings: LogTrackerSettings;
	readonly compiled: CompiledFormat;
	/** Anchored whole-line pattern; see `parseStampLine` for the group order. */
	readonly line: RegExp;
	/** Anchored pattern testing whether the line-so-far ends with the trigger. */
	readonly trigger: RegExp | null;
}

export interface ParsedStampLine {
	readonly indent: string;
	readonly marker: string;
	/** The timestamp text exactly as written; never rewritten by the audit. */
	readonly timestamp: string;
	/** The elapsed tag with its leading space, or `""` when the slot is empty. */
	readonly elapsedRaw: string;
	/** The elapsed value alone, or `null` when the slot is empty. */
	readonly elapsed: string | null;
	/** Everything after the suffix; never rewritten by the audit. */
	readonly rest: string;
	/** Column at which the elapsed slot starts. */
	readonly slotFrom: number;
	/** Column at which the elapsed slot ends (equal to `slotFrom` when empty). */
	readonly slotTo: number;
}

/**
 * Build the compiled grammar for a settings object. Callers cache this and
 * rebuild it when settings change; nothing here reads the clock.
 */
export function buildGrammar(settings: LogTrackerSettings): Grammar {
	const compiled = compileFormat(settings.timeFormat, settings.useUTC);
	const line = new RegExp(
		"^([ \\t]*)(" + LIST_MARKER + ")?" +
			escapeRegex(settings.prefix) +
			"(" + compiled.source + ")" +
			"((?:[ \\t]\\(" + ELAPSED_INNER + "\\))?)" +
			escapeRegex(settings.suffix) +
			"([\\s\\S]*)$",
	);
	const trigger =
		settings.trigger.length === 0 ? null : new RegExp(escapeRegex(settings.trigger) + "$");
	return { settings, compiled, line, trigger };
}

/**
 * Parse one line against the grammar, or return `null` if it is not a stamped
 * line. Column offsets are derived by addition from the captured groups rather
 * than from regex match indices, so no `d`-flag support is required.
 */
export function parseStampLine(line: string, grammar: Grammar): ParsedStampLine | null {
	if (!grammar.compiled.valid) {
		return null;
	}
	const match = grammar.line.exec(line);
	if (match === null) {
		return null;
	}
	const indent = match[1];
	const marker = match[2] ?? "";
	const timestamp = match[3];
	const elapsedRaw = match[4];
	const rest = match[5];
	const slotFrom =
		indent.length + marker.length + grammar.settings.prefix.length + timestamp.length;
	return {
		indent,
		marker,
		timestamp,
		elapsedRaw,
		elapsed: elapsedRaw === "" ? null : elapsedRaw.slice(2, -1),
		rest,
		slotFrom,
		slotTo: slotFrom + elapsedRaw.length,
	};
}

/** Assemble `prefix + timestamp + (elapsed) + suffix` from its parts. */
export function composeStamp(
	timestamp: string,
	elapsed: string | null,
	settings: LogTrackerSettings,
): string {
	const slot = elapsed === null ? "" : " (" + elapsed + ")";
	return settings.prefix + timestamp + slot + settings.suffix;
}

/**
 * Render a complete stamp for the instant `now`, measured against the timestamp
 * of the preceding stamped line (`null` when there is none).
 *
 * This is the single formatting path: the editor uses it to insert a stamp and
 * the settings tab uses it to draw its live preview, so the preview cannot
 * drift from what typing actually produces. An invalid format renders as the
 * raw format text with a zero elapsed tag rather than throwing.
 */
export function renderStamp(
	now: number,
	previousTimestamp: string | null,
	grammar: Grammar,
): string {
	const { settings, compiled } = grammar;
	const timestamp = compiled.valid
		? formatInstant(now, settings.timeFormat, settings.useUTC)
		: settings.timeFormat;
	if (!settings.elapsedEnabled) {
		return composeStamp(timestamp, null, settings);
	}
	const elapsed = compiled.valid
		? elapsedBetween(
				previousTimestamp,
				timestamp,
				compiled,
				settings.useUTC,
				settings.elapsedStyle,
			)
		: zeroElapsed(settings.elapsedStyle);
	return composeStamp(timestamp, elapsed, settings);
}
