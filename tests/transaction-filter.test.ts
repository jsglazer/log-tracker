import { EditorState } from "@codemirror/state";
import { describe, expect, it } from "vitest";

import { buildGrammar, type Grammar } from "../src/core/grammar";
import { DEFAULT_SETTINGS, type LogTrackerSettings } from "../src/core/settings";
import { CONTINUATION, createStampFilter } from "../src/core/transaction-filter";

/** 2026-09-07 09:42:26 UTC -- the clock is injected, never read. */
const NOW = Date.UTC(2026, 8, 7, 9, 42, 26);

function stateWith(doc: string, cursor: number, settings?: Partial<LogTrackerSettings>): EditorState {
	const merged: LogTrackerSettings = { ...DEFAULT_SETTINGS, useUTC: true, ...settings };
	const grammar: Grammar = buildGrammar(merged);
	return EditorState.create({
		doc,
		selection: { anchor: cursor },
		extensions: [EditorState.transactionFilter.of(createStampFilter({
			grammar: () => grammar,
			now: () => NOW,
		}))],
	});
}

/** Type `insert` at the cursor and return the resulting document. */
function type(state: EditorState, insert: string): string {
	const at = state.selection.main.head;
	return state.update({ changes: { from: at, insert }, selection: { anchor: at + insert.length } })
		.state.doc.toString();
}

describe("trigger expansion", () => {
	it("expands the trigger plus a space into a stamped bullet", () => {
		const state = stateWith("-[t]", 4);
		expect(type(state, " ")).toBe("- [2026-09-07 - 09:42:26 (00:00:00)] ");
	});

	it("measures elapsed against the nearest stamped line above", () => {
		const doc = "- [2026-09-07 - 09:22:04 (00:00:00)] first item\n-[t]";
		expect(type(stateWith(doc, doc.length), " ")).toBe(
			"- [2026-09-07 - 09:22:04 (00:00:00)] first item\n" +
				"- [2026-09-07 - 09:42:26 (00:20:22)] ",
		);
	});

	it("leaves the caret after the inserted stamp", () => {
		const state = stateWith("-[t]", 4);
		const at = state.selection.main.head;
		const next = state.update({ changes: { from: at, insert: " " } }).state;
		expect(next.selection.main.head).toBe(next.doc.length);
	});

	it("preserves indentation and does not add a second list marker", () => {
		expect(type(stateWith("\t\t-[t]", 6), " ")).toBe(
			"\t\t- [2026-09-07 - 09:42:26 (00:00:00)] ",
		);
		expect(type(stateWith("- -[t]", 6), " ")).toBe("- [2026-09-07 - 09:42:26 (00:00:00)] ");
	});

	it("only fires at the end of the line so far", () => {
		expect(type(stateWith("-[t] already expanded", 21), " ")).toBe("-[t] already expanded ");
	});

	it("does nothing for any other inserted character", () => {
		expect(type(stateWith("-[t]", 4), "x")).toBe("-[t]x");
	});

	it("honours a reconfigured trigger, escaping its metacharacters", () => {
		expect(type(stateWith("@@now", 5, { trigger: "@@now" }), " ")).toBe(
			"- [2026-09-07 - 09:42:26 (00:00:00)] ",
		);
		// The trigger is matched literally, not as the regex it resembles.
		expect(type(stateWith("a.c", 3, { trigger: "a.c" }), " ")).toBe(
			"- [2026-09-07 - 09:42:26 (00:00:00)] ",
		);
		expect(type(stateWith("abc", 3, { trigger: "a.c" }), " ")).toBe("abc ");
	});

	it("omits the elapsed slot when the elapsed stamp is off", () => {
		expect(type(stateWith("-[t]", 4, { elapsedEnabled: false }), " ")).toBe(
			"- [2026-09-07 - 09:42:26] ",
		);
	});

	it("passes the keystroke through untouched when the format is unusable", () => {
		expect(type(stateWith("-[t]", 4, { timeFormat: "[oops" }), " ")).toBe("-[t] ");
	});
});

describe("Enter continuation", () => {
	const LINE = "- [2026-09-07 - 09:22:04 (00:00:00)] first item";

	it("stamps the new bullet the desktop editor opens", () => {
		expect(type(stateWith(LINE, LINE.length), "\n- ")).toBe(
			LINE + "\n- [2026-09-07 - 09:42:26 (00:20:22)] ",
		);
	});

	it("absorbs a mobile composite insertion that carries a leading space", () => {
		expect(type(stateWith(LINE, LINE.length), " \n- ")).toBe(
			LINE + " \n- [2026-09-07 - 09:42:26 (00:20:22)] ",
		);
	});

	it("absorbs the desktop editor's real shape, which replays the last character of the line", () => {
		// `newlineAndIndentContinueMarkdownList` replaces the line's last character
		// with itself plus the newline and marker, rather than appending after it.
		const state = stateWith(LINE, LINE.length);
		const lastChar = LINE.charAt(LINE.length - 1);
		const next = state.update({
			changes: { from: LINE.length - 1, to: LINE.length, insert: lastChar + "\n- " },
		}).state;
		expect(next.doc.toString()).toBe(
			LINE + "\n- [2026-09-07 - 09:42:26 (00:20:22)] ",
		);
	});

	it("handles the other list markers a continuation can open with", () => {
		// CodeMirror rejects a bare "\r" in document text, so the CRLF shape is
		// covered by the CONTINUATION unit test below rather than by a dispatch.
		for (const inserted of ["\n* ", "\n+ ", "\n2. ", "\n\t- "]) {
			expect(type(stateWith(LINE, LINE.length), inserted), inserted).toContain(
				"[2026-09-07 - 09:42:26 (00:20:22)] ",
			);
		}
	});

	it("does not stamp an empty stamped bullet, so Enter can exit the list", () => {
		const empty = "- [2026-09-07 - 09:22:04 (00:00:00)] ";
		expect(type(stateWith(empty, empty.length), "\n- ")).toBe(empty + "\n- ");
	});

	it("does not stamp a plain unstamped bullet", () => {
		expect(type(stateWith("- ordinary", 10), "\n- ")).toBe("- ordinary\n- ");
	});

	it("ignores an insertion that is not a list continuation", () => {
		expect(type(stateWith(LINE, LINE.length), "\n")).toBe(LINE + "\n");
		expect(type(stateWith(LINE, LINE.length), "\n\n- ")).toBe(LINE + "\n\n- ");
	});

	it("recognises the shapes a continuation can take, and only those", () => {
		for (const good of ["\n- ", " \n- ", "\n\t* ", "\r\n1. ", "\n-"]) {
			expect(CONTINUATION.test(good), good).toBe(true);
		}
		for (const bad of ["\n", "\n- x", "- ", "\n\n- ", "x\n- "]) {
			expect(CONTINUATION.test(bad), bad).toBe(false);
		}
	});
});

describe("filter safety", () => {
	it("leaves multi-change transactions, such as an audit, entirely alone", () => {
		const doc = "- [2026-09-07 - 09:22:04 (00:00:00)] a\n- [2026-09-07 - 09:42:26 (00:00:00)] b";
		const state = stateWith(doc, 0);
		const firstSlot = doc.indexOf(" (00:00:00)");
		const secondSlot = doc.indexOf(" (00:00:00)", firstSlot + 1);
		const next = state.update({
			changes: [
				{ from: firstSlot, to: firstSlot + 11, insert: " (00:00:00)" },
				{ from: secondSlot, to: secondSlot + 11, insert: " (00:20:22)" },
			],
		}).state;
		expect(next.doc.toString()).toBe(
			"- [2026-09-07 - 09:22:04 (00:00:00)] a\n- [2026-09-07 - 09:42:26 (00:20:22)] b",
		);
	});

	it("leaves selection-only transactions alone", () => {
		const state = stateWith("-[t]", 4);
		expect(state.update({ selection: { anchor: 0 } }).state.doc.toString()).toBe("-[t]");
	});

	it("is one transaction per gesture, so undo restores the pre-trigger text", () => {
		const state = stateWith("-[t]", 4);
		const tr = state.update({ changes: { from: 4, insert: " " } });
		expect(tr.changes.desc.empty).toBe(false);
		expect(tr.startState.doc.toString()).toBe("-[t]");
		expect(tr.state.doc.toString()).toBe("- [2026-09-07 - 09:42:26 (00:00:00)] ");
	});
});
