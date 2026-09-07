/**
 * Settings tab, including the live stamp preview.
 *
 * The preview is drawn by calling the same pure `renderStamp()` the editor
 * calls, so there is no second copy of the formatting rules to drift out of
 * step. It redraws synchronously on every edit -- there is no `setInterval`
 * anywhere in this plugin -- and an unusable format renders an inline error
 * instead of throwing.
 */
import { type App, PluginSettingTab, Setting } from "obsidian";

import { buildGrammar } from "./core/grammar";
import { renderStamp } from "./core/grammar";
import type { ElapsedStyle, LogTrackerSettings } from "./core/settings";
import { formatInstant } from "./core/time";
import type LogTrackerPlugin from "./main";

/**
 * How far back the preview's synthetic previous entry sits, so the elapsed slot
 * shows a recognisable value rather than a row of zeroes.
 */
const PREVIEW_GAP_MS = (20 * 60 + 22) * 1000;

export class LogTrackerSettingTab extends PluginSettingTab {
	private readonly plugin: LogTrackerPlugin;
	private preview: HTMLElement | null = null;

	constructor(app: App, plugin: LogTrackerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Trigger keyword")
			.setDesc("Type this followed by a space to insert a stamped bullet.")
			.addText((text) =>
				text.setValue(this.plugin.settings.trigger).onChange((value) => {
					void this.commit({ trigger: value });
				}),
			);

		new Setting(containerEl)
			.setName("Time format")
			.setDesc("dayjs format tokens, for example YYYY-MM-DD - HH:mm:ss.")
			.addText((text) =>
				text.setValue(this.plugin.settings.timeFormat).onChange((value) => {
					void this.commit({ timeFormat: value });
				}),
			);

		new Setting(containerEl)
			.setName("Prefix")
			.setDesc("Text placed before the timestamp. Kept out of the time format, which reads square brackets as an escape.")
			.addText((text) =>
				text.setValue(this.plugin.settings.prefix).onChange((value) => {
					void this.commit({ prefix: value });
				}),
			);

		new Setting(containerEl)
			.setName("Suffix")
			.setDesc("Text placed after the elapsed tag.")
			.addText((text) =>
				text.setValue(this.plugin.settings.suffix).onChange((value) => {
					void this.commit({ suffix: value });
				}),
			);

		new Setting(containerEl)
			.setName("Use UTC")
			.setDesc("Render and read timestamps in UTC rather than the local time zone.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.useUTC).onChange((value) => {
					void this.commit({ useUTC: value });
				}),
			);

		new Setting(containerEl)
			.setName("Elapsed stamp")
			.setDesc("Append the time since the previous timestamped bullet.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.elapsedEnabled).onChange((value) => {
					void this.commit({ elapsedEnabled: value });
				}),
			);

		new Setting(containerEl)
			.setName("Elapsed style")
			.setDesc("Always show hours, or drop the hours group below one hour.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("hms", "HH:MM:SS")
					.addOption("auto", "Auto (MM:SS under an hour)")
					.setValue(this.plugin.settings.elapsedStyle)
					.onChange((value) => {
						void this.commit({ elapsedStyle: value as ElapsedStyle });
					}),
			);

		const previewSetting = new Setting(containerEl)
			.setName("Preview")
			.setDesc("How the next bullet renders right now.");
		this.preview = previewSetting.controlEl.createDiv({ cls: "log-tracker-preview" });
		this.renderPreview();
	}

	hide(): void {
		this.preview = null;
		this.containerEl.empty();
	}

	private async commit(patch: Partial<LogTrackerSettings>): Promise<void> {
		await this.plugin.updateSettings(patch);
		this.renderPreview();
	}

	/**
	 * Draw two consecutive bullets: a synthetic earlier entry and the entry the
	 * user would get if they typed the trigger now.
	 */
	private renderPreview(): void {
		const target = this.preview;
		if (target === null) {
			return;
		}
		target.empty();

		const settings = this.plugin.settings;
		const grammar = buildGrammar(settings);
		if (!grammar.compiled.valid) {
			target.createDiv({
				cls: "log-tracker-preview-error",
				text: `Invalid time format: ${grammar.compiled.error ?? "unusable"}`,
			});
			return;
		}

		const now = Date.now();
		const earlier = now - PREVIEW_GAP_MS;
		const earlierStamp = formatInstant(earlier, settings.timeFormat, settings.useUTC);
		target.createDiv({
			text: "- " + renderStamp(earlier, null, grammar) + " earlier entry",
		});
		target.createDiv({
			text: "- " + renderStamp(now, earlierStamp, grammar) + " this entry",
		});
	}
}
