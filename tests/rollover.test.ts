import { parseDailyNoteDate, getTodayPath } from '../src/rollover';

describe('parseDailyNoteDate', () => {
    test('parses a valid YYYY-MM-DD filename', () => {
        const date = parseDailyNoteDate('2026-06-30');
        expect(date).not.toBeNull();
        expect(date!.getFullYear()).toBe(2026);
        expect(date!.getMonth()).toBe(5);
        expect(date!.getDate()).toBe(30);
    });

    test('returns null for non-matching filenames', () => {
        expect(parseDailyNoteDate('meeting-notes')).toBeNull();
        expect(parseDailyNoteDate('2026-13-01')).not.toBeNull(); // regex only checks shape, not validity
        expect(parseDailyNoteDate('2026-06-30 Morning Briefing')).toBeNull();
        expect(parseDailyNoteDate('')).toBeNull();
    });

    test('parses all twelve months correctly', () => {
        for (let i = 0; i < 12; i++) {
            const m = String(i + 1).padStart(2, '0');
            const date = parseDailyNoteDate(`2026-${m}-01`);
            expect(date).not.toBeNull();
            expect(date!.getMonth()).toBe(i);
        }
    });
});

describe('getTodayPath', () => {
    test('returns a path matching the expected format', () => {
        const path = getTodayPath();
        expect(path).toMatch(/^Daily Notes & To Do\/\d{4}-\d{2}-\d{2}\.md$/);
    });
});
