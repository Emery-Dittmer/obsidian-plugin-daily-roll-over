import { execFile } from 'child_process';

// On Windows, .cmd/.bat shims (e.g. npm-installed CLIs) must be run with shell: true —
// Electron's child_process does not resolve them via the same PATHEXT lookup plain Node does,
// which otherwise surfaces as EINVAL when Obsidian invokes execFile directly.
function needsShell(binPath: string): boolean {
    return process.platform === 'win32' && /\.(cmd|bat)$/i.test(binPath);
}

export function summarize(
    freeFormContent: string,
    claudePath: string,
    prompt: string
): Promise<string | null> {
    const fullPrompt = `${prompt}\n\n${freeFormContent}`;

    return new Promise((resolve) => {
        execFile(
            claudePath,
            ['-p', fullPrompt],
            { timeout: 30000, shell: needsShell(claudePath) },
            (error, stdout, stderr) => {
                if (error) {
                    console.error('Wivoo Daily Rollover: Claude CLI failed', error, stderr);
                    resolve(null);
                } else if (!stdout.trim()) {
                    resolve(null);
                } else {
                    resolve(stdout.trim());
                }
            }
        );
    });
}
