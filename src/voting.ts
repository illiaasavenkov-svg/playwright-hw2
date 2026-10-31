export const VOTING_AGE = 18;

export function getVotingMessage(age: number): string {
  if (age >= VOTING_AGE) {
    return 'Ви можете голосувати.';
  } else {
    return 'Ви ще не можете голосувати.';
  }
}
