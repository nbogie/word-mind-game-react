export type Guess = string;
export type LetterState = 'placed' | 'partial' | 'notInWord' | 'untried';

export type LetterStates = Record<string, LetterState>

