jest.mock('child_process', () => ({ execFile: jest.fn() }));

import { execFile } from 'child_process';
import { summarize } from '../src/claudeSummarize';

afterEach(() => jest.clearAllMocks());

test('returns trimmed stdout on success', async () => {
    (execFile as jest.Mock).mockImplementationOnce(
        (_p: string, _a: string[], _o: any, cb: Function) => cb(null, '- bullet 1\n- bullet 2\n', '')
    );
    const result = await summarize('content', 'claude', 'Summarize this');
    expect(result).toBe('- bullet 1\n- bullet 2');
});

test('returns null on non-zero exit (error object set)', async () => {
    (execFile as jest.Mock).mockImplementationOnce(
        (_p: string, _a: string[], _o: any, cb: Function) => cb(new Error('Command failed'), '', '')
    );
    const result = await summarize('content', 'claude', 'Summarize this');
    expect(result).toBeNull();
});

test('returns null when stdout is blank', async () => {
    (execFile as jest.Mock).mockImplementationOnce(
        (_p: string, _a: string[], _o: any, cb: Function) => cb(null, '   \n', '')
    );
    const result = await summarize('content', 'claude', 'Summarize this');
    expect(result).toBeNull();
});

test('passes prompt and content as single -p argument', async () => {
    (execFile as jest.Mock).mockImplementationOnce(
        (_p: string, _a: string[], _o: any, cb: Function) => cb(null, '- ok', '')
    );
    await summarize('my notes', 'claude', 'Summarize this');
    expect(execFile).toHaveBeenCalledWith(
        'claude',
        ['-p', 'Summarize this\n\nmy notes'],
        expect.objectContaining({ timeout: 30000 }),
        expect.any(Function)
    );
});

test('runs .cmd binaries through a shell on Windows', async () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });
    (execFile as jest.Mock).mockImplementationOnce(
        (_p: string, _a: string[], _o: any, cb: Function) => cb(null, '- ok', '')
    );
    await summarize('my notes', 'C:\\npm\\claude.cmd', 'Summarize this');
    expect(execFile).toHaveBeenCalledWith(
        'C:\\npm\\claude.cmd',
        expect.any(Array),
        expect.objectContaining({ shell: true }),
        expect.any(Function)
    );
    Object.defineProperty(process, 'platform', { value: originalPlatform });
});

test('does not use a shell for non-.cmd binaries', async () => {
    (execFile as jest.Mock).mockImplementationOnce(
        (_p: string, _a: string[], _o: any, cb: Function) => cb(null, '- ok', '')
    );
    await summarize('my notes', 'claude', 'Summarize this');
    expect(execFile).toHaveBeenCalledWith(
        'claude',
        expect.any(Array),
        expect.objectContaining({ shell: false }),
        expect.any(Function)
    );
});
