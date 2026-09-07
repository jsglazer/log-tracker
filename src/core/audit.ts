/**
 * The "Audit elapsed stamps" transformer.
 *
 * A pure function from document text plus settings to a list of replacements.
 * It touches only the elapsed slot: the timestamp text and the user's content
 * are copied through untouched, because they are never part of a replacement
 * range. Each replacement is expressed as an absolute document offset span so
 * the shell can dispatch every one of them in a single `changes` array -- one
 * atomic transaction, one undo step, selection preserved.
 *
 * The transformer is idempotent by construction: it recomputes the slot from
 * the timestamps already in the document and emits a replacement only where the
 * text would actually differ, so a second consecutive run produces no changes.
 */
import { elapsedBetween } from "./elapsed";
import type { Grammar } from "./grammar";
import { parseStampLine } from "./grammar";

export interface SlotReplacement {
	/** Zero-based line index, for diagnostics and tests. */
	readonly line: number;
	/** Absolute document offset where the elapsed slot starts. */
	readonly from: number;
	/** Absolute document offset where the elapsed slot ends. */
	readonly to: number;
	/** Replacement text: ` (HH:MM:SS)`, or `""` when stripping the tag. */
	readonly text: string;
}

export interface AuditResult {
	readonly replacements: readonly SlotReplacement[];
	/** Stamped lines whose elapsed tag was recalculated. */
	readonly updated: number;
	/** Stamped lines that had no tag and gained one. */
	readonly inserted: number;
	/** Stamped lines whose tag was stripped because elapsed is disabled. */
	readonly removed: number;
	/** Stamped lines already correct. */
	readonly unchanged: number;
	/** Lines that are not stamped lines, or whose timestamp will not parse. */
	readonly skipped: number;
}

/**
 * Audit `text` against `grammar`. Line endings are preserved: the scan splits
 * on `\n` and every replacement span sits strictly inside a line, so a `\r`
 * before the newline is never inside a replacement range.
 */
export function auditDocument(text: string, grammar: Grammar): AuditResult {
	const empty: AuditResult = {
		replacements: [],
		updated: 0,
		inserted: 0,
		removed: 0,
		unchanged: 0,
		skipped: 0,
	};
	if (!grammar.compiled.valid) {
		return empty;
	}

	const { settings, compiled } = grammar;
	const lines = text.split("\n");
	const replacements: SlotReplacement[] = [];
	let updated = 0;
	let inserted = 0;
	let removed = 0;
	let unchanged = 0;
	let skipped = 0;

	let lineStart = 0;
	let previousTimestamp: string | null = null;

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		const parsed = parseStampLine(line, grammar);
		if (parsed === null) {
			skipped += 1;
			lineStart += line.length + 1;
			continue;
		}

		const wanted = settings.elapsedEnabled
			? " (" +
				elapsedBetween(
					previousTimestamp,
					parsed.timestamp,
					compiled,
					settings.useUTC,
					settings.elapsedStyle,
				) +
				")"
			: "";

		if (wanted !== parsed.elapsedRaw) {
			replacements.push({
				line: index,
				from: lineStart + parsed.slotFrom,
				to: lineStart + parsed.slotTo,
				text: wanted,
			});
			if (wanted === "") removed += 1;
			else if (parsed.elapsedRaw === "") inserted += 1;
			else updated += 1;
		} else {
			unchanged += 1;
		}

		// The anchor for the next line is this line's timestamp, whether or not
		// its tag needed correcting.
		previousTimestamp = parsed.timestamp;
		lineStart += line.length + 1;
	}

	return { replacements, updated, inserted, removed, unchanged, skipped };
}

/** Apply an audit result to text. Used by tests to assert idempotency. */
export function applyReplacements(text: string, replacements: readonly SlotReplacement[]): string {
	let output = "";
	let cursor = 0;
	for (const replacement of replacements) {
		output += text.slice(cursor, replacement.from) + replacement.text;
		cursor = replacement.to;
	}
	return output + text.slice(cursor);
}

/**
 * Where `offset` lands after `replacements` are applied. Used to carry the
 * caret across an audit: offsets before a replacement are untouched, offsets
 * after one shift by its length delta, and an offset inside one is pulled to
 * the end of the replacement text.
 */
export function mapOffset(offset: number, replacements: readonly SlotReplacement[]): number {
	let mapped = offset;
	for (const replacement of replacements) {
		if (replacement.to <= offset) {
			mapped += replacement.text.length - (replacement.to - replacement.from);
		} else if (replacement.from < offset) {
			mapped = replacement.from + replacement.text.length;
			break;
		} else {
			break;
		}
	}
	return mapped;
}

export interface TextPosition {
	readonly line: number;
	readonly ch: number;
}

/** Convert an absolute offset in `text` to a zero-based line/column position. */
export function offsetToPosition(text: string, offset: number): TextPosition {
	const clamped = Math.max(0, Math.min(offset, text.length));
	let line = 0;
	let lineStart = 0;
	for (let index = 0; index < clamped; index += 1) {
		if (text.charCodeAt(index) === 10) {
			line += 1;
			lineStart = index + 1;
		}
	}
	return { line, ch: clamped - lineStart };
}
