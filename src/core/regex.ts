/**
 * Regex helpers shared by the format compiler and the line grammar.
 *
 * Every piece of user-configurable text (prefix, suffix, trigger, and the
 * literal runs inside a time format) is escaped through `escapeRegex` before it
 * reaches a pattern, so a user who sets their prefix to `(` cannot alter the
 * structure of the grammar.
 */

const SPECIALS = /[.*+?^${}()|[\]\\]/g;

/** Escape every regex metacharacter in `text` so it matches literally. */
export function escapeRegex(text: string): string {
	return text.replace(SPECIALS, "\\$&");
}
