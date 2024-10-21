import { expect, test } from 'vitest';
import { formatDate } from '$lib/functions';

test('formatDate returns the correct date string', () => {
	expect(formatDate('2024-10-16')).toBe('16.10.2024');
	expect(formatDate('2024-01-01')).toBe('1.1.2024');
	expect(formatDate('2024-12-31')).toBe('31.12.2024');
});

test('formatDate handles invalid date strings', () => {
	expect(formatDate('invalid-date')).toBe('Invalid Date');
	expect(formatDate('')).toBe('Invalid Date');
	expect(formatDate('2024-13-01')).toBe('Invalid Date');
	expect(formatDate('2024-12-32')).toBe('Invalid Date');
});
