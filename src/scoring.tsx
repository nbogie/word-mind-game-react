import { Guess } from "./types";

export function scoreGuess(guess: Guess, target: string): ScoredLetter[] {
    return zip(guess.split(''), target.split('')).map(([gLetter, tLetter]) => scoreLetter(gLetter, tLetter, target))
}

function zip<T>(arr1: T[], arr2: T[]): [T, T][] {
    return arr1.map((el, ix) => [el, arr2[ix]]);
}

export type ScoreCategory = 'placed' | 'partial' | 'notInWord';
export interface ScoredLetter {
    letter: string;
    score: ScoreCategory;
}
export function scoreLetter(guessLetter: string, targetLetter: string, target: string): ScoredLetter {
    let score: ScoreCategory;

    if (guessLetter === targetLetter) {
        score = 'placed';
    } else {
        if (target.includes(guessLetter)) {
            score = 'partial';
        }
        else {
            score = 'notInWord';
        }
    }
    return { letter: guessLetter, score }
}

