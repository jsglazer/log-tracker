/**
 * Plugin shell.
 *
 * This is the only file that imports `obsidian`. It owns settings persistence,
 * command registration and the editor transaction, and delegates every decision
 * to the pure modules under `src/core/`. It supplies the one clock in the
 * plugin (`Date.now`) to the filter, and registers no timers, intervals or
 * update listeners: an elapsed value is frozen at insertion and the audit
 * command is the only path that recomputes one.
 *
 * No undocumented Obsidian internals are used. Document edits go through the
 * public `Editor.transaction`, never through the vault adapter or `fs`.
 */
import { EditorState } from "@codemirror/state";
import { type Editor, type MarkdownFileInfo, MarkdownView, Notice, Plugin } from "obsidian";

import {
	applyReplacements,
	auditDocument,
	mapOffset,
	offsetToPosition,
} from "./core/audit";
import { buildGrammar, type Grammar } from "./core/grammar";
import { DEFAULT_SETTINGS, type LogTrackerSettings } from "./core/settings";
import { createStampFilter } from "./core/transaction-filter";
import { LogTrackerSettingTab } from "./settings-tab";

export default class LogTrackerPlugin extends Plugin {
	settings: LogTrackerSettings = DEFAULT_SETTINGS;
	private grammar: Grammar = buildGrammar(DEFAULT_SETTINGS);

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerEditorExtension(
			EditorState.transactionFilter.of(
				createStampFilter({
					grammar: () => this.grammar,
					now: () => Date.now(),
				}),
			),
		);

		this.addCommand({
			id: "toggle-elapsed-stamp",
			name: "Toggle elapsed stamp",
			callback: () => {
				void this.toggleElapsed();
			},
		});

		this.addCommand({
			id: "audit-elapsed-stamps",
			name: "Audit elapsed stamps",
			editorCallback: (editor: Editor, _view: MarkdownView | MarkdownFileInfo) => {
				this.auditActiveDocument(editor);
			},
		});

		this.addSettingTab(new LogTrackerSettingTab(this.app, this));
	}

	/** Current compiled grammar, rebuilt whenever settings change. */
	getGrammar(): Grammar {
		return this.grammar;
	}

	async loadSettings(): Promise<void> {
		const stored = (await this.loadData()) as Partial<LogTrackerSettings> | null;
		this.settings = { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
		this.grammar = buildGrammar(this.settings);
	}

	async updateSettings(patch: Partial<LogTrackerSettings>): Promise<void> {
		this.settings = { ...this.settings, ...patch };
		this.grammar = buildGrammar(this.settings);
		await this.saveData(this.settings);
	}

	private async toggleElapsed(): Promise<void> {
		await this.updateSettings({ elapsedEnabled: !this.settings.elapsedEnabled });
		new Notice(
			this.settings.elapsedEnabled ? "Log Tracker: elapsed stamp on" : "Log Tracker: elapsed stamp off",
		);
	}

	/**
	 * Recompute every elapsed tag in the active document and write the whole
	 * correction as one transaction: a single `changes` array, one undo step,
	 * and the caret carried to where it lands in the corrected text.
	 */
	private auditActiveDocument(editor: Editor): void {
		if (!this.grammar.compiled.valid) {
			new Notice(`Log Tracker: time format is invalid (${this.grammar.compiled.error ?? ""})`);
			return;
		}

		const text = editor.getValue();
		const result = auditDocument(text, this.grammar);
		if (result.replacements.length === 0) {
			new Notice(`Log Tracker: ${result.unchanged} stamp(s) already correct, nothing to change`);
			return;
		}

		const selection = editor.listSelections()[0];
		const anchor = selection === undefined ? 0 : editor.posToOffset(selection.anchor);
		const head = selection === undefined ? 0 : editor.posToOffset(selection.head);
		const audited = applyReplacements(text, result.replacements);
		const from = offsetToPosition(audited, mapOffset(anchor, result.replacements));
		const to = offsetToPosition(audited, mapOffset(head, result.replacements));

		editor.transaction({
			changes: result.replacements.map((replacement) => ({
				from: editor.offsetToPos(replacement.from),
				to: editor.offsetToPos(replacement.to),
				text: replacement.text,
			})),
			selection: { from, to },
		});

		new Notice(
			`Log Tracker: ${result.updated} corrected, ${result.inserted} added, ` +
				`${result.removed} removed, ${result.unchanged} unchanged`,
		);
	}
}
