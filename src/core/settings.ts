/**
 * Plugin settings and their v1 defaults.
 *
 * Pure data: this module imports nothing at all, and in particular nothing from
 * `obsidian`. The wrapper around a stamp is `prefix`/`suffix` rather than part
 * of `timeFormat`, because dayjs treats square brackets in a format string as
 * literal-escape syntax -- baking `[` and `]` into the format would render the
 * tokens inside them as literal text.
 */

/** How the elapsed tag is rendered. */
export type ElapsedStyle = "hms" | "auto";

export interface LogTrackerSettings {
	/** dayjs format tokens used to render and to strictly re-parse a timestamp. */
	readonly timeFormat: string;
	/** Literal text placed immediately before the timestamp. */
	readonly prefix: string;
	/** Literal text placed immediately after the elapsed slot. */
	readonly suffix: string;
	/** Render and interpret timestamps in UTC rather than the local zone. */
	readonly useUTC: boolean;
	/** Append the elapsed-since-previous-stamp tag. */
	readonly elapsedEnabled: boolean;
	/** `hms` always shows hours; `auto` drops the hours group below one hour. */
	readonly elapsedStyle: ElapsedStyle;
	/** Literal keyword that expands into a stamped bullet when followed by a space. */
	readonly trigger: string;
}

/**
 * v1 defaults. These deliberately diverge from the reference plugin's `HH:mm`
 * / UTC-true defaults: elapsed math needs both a seconds component (so short
 * intervals are visible) and a date component (so day rollovers are real
 * arithmetic rather than a guess).
 */
export const DEFAULT_SETTINGS: LogTrackerSettings = {
	timeFormat: "YYYY-MM-DD - HH:mm:ss",
	prefix: "[",
	suffix: "]",
	useUTC: false,
	elapsedEnabled: true,
	elapsedStyle: "hms",
	trigger: "-[t]",
};
