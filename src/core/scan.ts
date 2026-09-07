/**
 * Upward scan for the anchor a new stamp is measured against.
 *
 * The anchor is the nearest preceding line that matches the stamp grammar,
 * whatever its indent depth or list marker. Headings, blank lines, code fences
 * and ordinary prose are skipped rather than treated as barriers, because a log
 * is routinely interrupted by them and the previous entry is still the previous
 * entry. No match yields `null`, which the caller renders as a zero elapsed tag.
 */
import type { Grammar } from "./grammar";
import { parseStampLine } from "./grammar";

/**
 * The timestamp of the nearest stamped line strictly above `beforeLine`, or
 * `null` if there is none. `beforeLine` is a zero-based index into `lines`; the
 * line at that index is not itself examined.
 */
export function findPreviousTimestamp(
	lines: readonly string[],
	beforeLine: number,
	grammar: Grammar,
): string | null {
	for (let index = Math.min(beforeLine, lines.length) - 1; index >= 0; index -= 1) {
		const parsed = parseStampLine(lines[index], grammar);
		if (parsed !== null) {
			return parsed.timestamp;
		}
	}
	return null;
}
