/**
 * The CodeMirror 6 transaction filter that turns typing into stamped bullets.
 *
 * This module imports `@codemirror/state` and nothing else -- no `obsidian`, no
 * DOM, no filesystem -- so the whole of its behaviour is exercised headlessly by
 * building an `EditorState` in a test and dispatching a transaction at it.
 *
 * A filter (rather than an update listener) is what makes this work on mobile:
 * the keystroke is rewritten before it is applied, so there is no intermediate
 * state to flicker and nothing to undo separately. Both recognised gestures
 * replace the incoming transaction with a single equivalent one.
 */
import { EditorState, Transaction, type TransactionSpec } from "@codemirror/state";

import type { Grammar } from "./grammar";
import { parseStampLine, renderStamp } from "./grammar";
import { findPreviousTimestamp } from "./scan";

/**
 * A newline followed by a list marker, with optional whitespace on either side.
 *
 * Deliberately generalized rather than a literal `"\n- "` test: a mobile
 * virtual keyboard commits Enter as a composite insertion such as `" \n- "`,
 * with a leading space belonging to the line being left. Matching the shape
 * instead of the exact two characters absorbs those variants.
 */
export const CONTINUATION = /^[ \t]*\r?\n[ \t]*(?:[-*+]|\d+[.)])[ \t]*$/;

/** Everything the filter needs from the plugin shell, injected rather than read. */
export interface FilterContext {
	/** Current compiled grammar; rebuilt by the shell when settings change. */
	readonly grammar: () => Grammar;
	/** The current instant. The only clock in the plugin lives behind this. */
	readonly now: () => number;
}

interface SingleChange {
	readonly fromA: number;
	readonly toA: number;
	readonly inserted: string;
}

/** The sole change in a transaction, or `null` if there is not exactly one. */
function soleChange(tr: Transaction): SingleChange | null {
	let found: SingleChange | null = null;
	let count = 0;
	tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
		count += 1;
		if (count === 1) {
			found = { fromA, toA, inserted: inserted.toString() };
		}
	});
	return count === 1 ? found : null;
}

/**
 * Build the filter function. Register it with
 * `EditorState.transactionFilter.of(...)` at the shell boundary.
 */
export function createStampFilter(
	context: FilterContext,
): (tr: Transaction) => TransactionSpec | readonly TransactionSpec[] {
	return (tr) => {
		if (!tr.docChanged || tr.isUserEvent("undo") || tr.isUserEvent("redo")) {
			return tr;
		}
		const grammar = context.grammar();
		if (!grammar.compiled.valid) {
			return tr;
		}
		const change = soleChange(tr);
		if (change === null) {
			return tr;
		}
		return (
			expandTrigger(tr, change, grammar, context.now()) ??
			continueList(tr, change, grammar, context.now()) ??
			tr
		);
	};
}

/**
 * `-[t]` followed by a space becomes a stamped bullet.
 *
 * The trigger is matched only at the end of the line-so-far, so the same
 * characters appearing earlier in the line, or in a line the user is not
 * currently typing at, are left alone.
 */
function expandTrigger(
	tr: Transaction,
	change: SingleChange,
	grammar: Grammar,
	now: number,
): TransactionSpec | null {
	if (change.inserted !== " " || change.toA !== change.fromA || grammar.trigger === null) {
		return null;
	}
	const line = tr.startState.doc.lineAt(change.fromA);
	const before = line.text.slice(0, change.fromA - line.from);
	if (!grammar.trigger.test(before)) {
		return null;
	}

	const triggerStart = change.fromA - grammar.settings.trigger.length;
	const beforeTrigger = before.slice(0, before.length - grammar.settings.trigger.length);
	// The trigger is consumed whole, so supply a list marker when the line does
	// not already have one -- and never a second one when it does.
	const marker = /^[ \t]*$/.test(beforeTrigger) ? "- " : "";

	const previous = findPreviousTimestamp(docLines(tr.startState), line.number - 1, grammar);
	const insert = marker + renderStamp(now, previous, grammar) + " ";
	return {
		changes: { from: triggerStart, to: change.fromA, insert },
		selection: { anchor: triggerStart + insert.length },
		scrollIntoView: true,
	};
}

/**
 * Enter at the end of a stamped bullet continues the log with a fresh stamp,
 * measured against the line just left.
 *
 * An empty bullet is left entirely alone: the editor's own outdent-and-exit
 * behaviour applies, and no stamp is inserted into a line the user is trying to
 * get out of.
 */
function continueList(
	tr: Transaction,
	change: SingleChange,
	grammar: Grammar,
	now: number,
): TransactionSpec | null {
	if (!CONTINUATION.test(change.inserted)) {
		return null;
	}
	const line = tr.startState.doc.lineAt(change.fromA);
	const parsed = parseStampLine(line.text, grammar);
	if (parsed === null || parsed.rest.trim() === "") {
		return null;
	}

	const insert =
		change.inserted.replace(/[ \t]*$/, "") + " " + renderStamp(now, parsed.timestamp, grammar) + " ";
	return {
		changes: { from: change.fromA, to: change.toA, insert },
		selection: { anchor: change.fromA + insert.length },
		scrollIntoView: true,
	};
}

/** The document as an array of lines, for the upward scan. */
function docLines(state: EditorState): string[] {
	return state.doc.toString().split("\n");
}
