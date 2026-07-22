# Wivoo Daily Rollover

An [Obsidian](https://obsidian.md) plugin that rolls over unchecked todos from your most recent daily note into today's note, and generates an AI summary of yesterday's free-form notes using the [Claude Code CLI](https://docs.claude.com/en/docs/claude-code).

## What it does

Run the "Roll over daily note" command (or click the ribbon icon) and the plugin will:

1. Find your most recent daily note before today.
2. Copy over any unchecked todos (checked todos and their sub-items are skipped), highlighting them in red so it's obvious they're carried over from a previous day.
3. Send the rest of the note's free-form content to the `claude` CLI and prepend an AI-generated summary — action items and key context — to today's note.
4. Create today's note if it doesn't exist yet, or safely prepend to it if it does (with a confirmation prompt if a rollover has already been run today).

## Requirements

- Obsidian desktop (this plugin is desktop-only; it shells out to a local CLI).
- The [Claude Code CLI](https://docs.claude.com/en/docs/claude-code) installed and available on your `PATH` (or configured via the plugin's settings) if you want AI summaries. Rollover of todos still works without it — the summary is just skipped.
- Daily notes stored as Markdown files in a single folder, named `YYYY-MM-DD.md` (e.g. `2026-06-30.md`).

## Installation

### Manual install (recommended until this is on the community plugin store)

1. Download `main.js` and `manifest.json` from the [latest release](../../releases) (or from this repo directly).
2. In your Obsidian vault, go to `<your vault>/.obsidian/plugins/` and create a new folder called `wivoo-daily-rollover`.
3. Copy `main.js` and `manifest.json` into that folder.
4. In Obsidian, go to **Settings → Community plugins**, and if plugins are restricted, turn on **Community plugins**.
5. Find **Wivoo Daily Rollover** in the installed plugins list and enable it.

### Build from source

```bash
git clone https://github.com/Emery-Dittmer/obsidian-plugin-daily-roll-over.git
cd obsidian-plugin-daily-roll-over
npm install
npm run build
```

This produces `main.js`. Copy `main.js` and `manifest.json` into `<your vault>/.obsidian/plugins/wivoo-daily-rollover/` as described above.

### Development

```bash
npm run dev
```

Runs esbuild in watch mode, rebuilding `main.js` on every change. Symlink or copy the plugin folder into your vault's `.obsidian/plugins/` directory to test live.

## Configuration

Open **Settings → Wivoo Daily Rollover** to configure:

- **Claude binary path** — path to the `claude` CLI executable. Defaults to `claude` (resolved via `PATH`).
- **Summary prompt** — the prompt sent to Claude along with yesterday's free-form note content.
- **Add divider after rollover block** — whether to insert a `---` horizontal rule after the rolled-over content.

## Note format

The plugin expects daily notes to live in a single folder (`Daily Notes & To Do` by default — edit `DAILY_NOTE_FOLDER` in `src/rollover.ts` if your vault uses a different folder name) with filenames like `2026-06-30.md`.

Todos should use standard Obsidian checkbox syntax:

```markdown
- [ ] An open todo (will be rolled over)
- [x] A completed todo (will not be rolled over)
    - [ ] Its child items are skipped too, even if unchecked
```

## Testing

```bash
npm test
```

Runs the Jest test suite covering note parsing, note writing, rollover orchestration, and the Claude CLI wrapper.

## License

MIT
