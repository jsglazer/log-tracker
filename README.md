# log-tracker

[![GitHub release](https://img.shields.io/github/v/release/jsglazer/log-tracker?logo=github)](https://github.com/jsglazer/log-tracker/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/jsglazer/log-tracker/blob/main/LICENSE)
[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97756?logo=anthropic)](https://claude.ai)
[![Gemini Flash Antigravity](https://img.shields.io/badge/Gemini%20Flash-Antigravity-4f86f7?logo=google-gemini&logoColor=white)](https://github.com/google-gemini)

An Obsidian plugin for keeping a timestamped log. Type a trigger keyword and it expands into a bullet stamped with the current time **and the time elapsed since the previous stamped bullet** — so a running log tells you not just when each thing happened, but how long it took.

Works on desktop and mobile.

## What it does

Type `-[t]` followed by a space:

```markdown
- [2026-09-07 - 09:22:04 (00:00:00)] first item
- [2026-09-07 - 09:42:26 (00:20:22)] next item
- [2026-09-07 - 09:45:37 (00:03:11)] third item
```

The first entry has nothing above it, so its elapsed tag reads zero. Every entry after that is measured against the nearest stamped line above it.

Pressing <kbd>Enter</kbd> at the end of a stamped bullet continues the log: the new bullet arrives already stamped. Pressing <kbd>Enter</kbd> on an empty bullet exits the list as usual, without inserting anything.

## Commands

| Command | What it does |
| --- | --- |
| **Toggle elapsed stamp** | Turns the elapsed tag on or off without opening settings. |
| **Audit elapsed stamps** | Recomputes every elapsed tag in the active note from the timestamps actually written there. |

**Audit elapsed stamps** is what makes hand-editing safe. Correct a timestamp you got wrong, paste entries in from elsewhere, or reorder a log, then run the audit: every tag is recalculated in a single edit — one undo step, cursor where you left it. It rewrites only the elapsed tag, never a timestamp and never your own text, and running it twice in a row changes nothing the second time.

## Settings

| Setting | Default | Notes |
| --- | --- | --- |
| Trigger keyword | `-[t]` | Any literal text. Expands when followed by a space, and only at the end of the line you are typing. |
| Time format | `YYYY-MM-DD - HH:mm:ss` | [dayjs](https://day.js.org/docs/en/display/format) tokens. |
| Prefix | `[` | Text before the timestamp. |
| Suffix | `]` | Text after the elapsed tag. |
| Use UTC | off | Render and read timestamps in UTC rather than local time. |
| Elapsed stamp | on | Append the elapsed tag. |
| Elapsed style | `HH:MM:SS` | `Auto` drops the hours group for gaps under an hour. |

The settings tab shows a live preview of exactly what the next bullet will look like, redrawn as you type. An unusable format says so inline rather than failing silently.

### Two things worth knowing about the format

**The brackets are a separate setting, not part of the format.** dayjs reads square brackets in a format string as literal-escape syntax, so putting `[` and `]` in the format itself would print your tokens as literal text instead of a time. That is why the wrapper is its own prefix/suffix pair.

**The default format includes a date and seconds on purpose.** Elapsed time needs seconds to be visible at all for short intervals, and a date to tell a real day boundary from a clock that merely wrapped around. If you choose a time-only format, the plugin still works: a backwards gap is read as a single crossing of midnight. If it is still backwards after that, or if the format has no time of day at all, the tag falls back to zero rather than showing a negative number.

## Installation

Until this is in the community plugin browser, install it manually:

1. Download `main.js`, `manifest.json` and `styles.css` from the [latest release](https://github.com/jsglazer/log-tracker/releases).
2. Put them in `<vault>/.obsidian/plugins/log-tracker/`.
3. Reload Obsidian and enable **Log Tracker** under Settings → Community plugins.

## Development

```bash
npm install
npm test        # vitest, fully headless
npm run build   # typecheck, then bundle to main.js
npm run dev     # rebuild on change
```

All decision logic lives in `src/core/`, which imports nothing from `obsidian`, never reads the clock (every instant is passed in), and touches no filesystem. `src/main.ts` and `src/settings-tab.ts` are the only files that know Obsidian exists. That split is what makes the test suite headless, and it is enforced by a test — `tests/purity.test.ts` fails the build if a clock call or an `obsidian` import appears in the core.

## Credits

A clean-room reimplementation inspired by the behaviour of [pedrogdn/obsidian-time-bullet-plugin](https://github.com/pedrogdn/obsidian-time-bullet-plugin) (MIT). No code was copied from it.

## License

[MIT](LICENSE)
