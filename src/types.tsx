export type Guess = string;
type LetterState = 'untried' | 'found' | 'absent';
export type LetterStates = { [key: string]: LetterState };
