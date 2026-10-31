import { test, expect } from '@playwright/test';
import { getVotingMessage } from '../src/voting';

const CAN_VOTE = 'Ви можете голосувати.';
const CANNOT_VOTE = 'Ви ще не можете голосувати.';

test.describe('getVotingMessage', () => {
  // Boundary values around the voting age threshold (18).
  const boundaryCases = [
    { age: 17, description: 'value before the threshold', expected: CANNOT_VOTE },
    { age: 18, description: 'the threshold itself', expected: CAN_VOTE },
    { age: 19, description: 'value after the threshold', expected: CAN_VOTE },
  ];

  // One representative value inside each equivalence class.
  const equivalenceCases = [
    { age: 10, description: 'user younger than 18', expected: CANNOT_VOTE },
    { age: 30, description: 'user aged 18 or older', expected: CAN_VOTE },
  ];

  for (const { age, description, expected } of boundaryCases) {
    test(`boundary: age ${age} (${description}) returns "${expected}"`, () => {
      expect(getVotingMessage(age)).toBe(expected);
    });
  }

  for (const { age, description, expected } of equivalenceCases) {
    test(`equivalence class: age ${age} (${description}) returns "${expected}"`, () => {
      expect(getVotingMessage(age)).toBe(expected);
    });
  }
});
