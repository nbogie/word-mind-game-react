import { ScoredLetterView } from "./ScoredLetter";
import { Guess } from "./types";

interface GuessViewProps {
    guess: Guess;
    target: string;
}

export function GuessView(props: GuessViewProps) {
    const cells = scoreGuess(props.guess, props.target);

    return (
        <div className='guessRow'>
            {cells.map((scoredLetter, ix) => <ScoredLetterView
                scoredLetter={scoredLetter}
                key={ix} />)}
        </div>
    );
}

function scoreGuess(guess: Guess, target: string): ScoredLetter[] {
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
function scoreLetter(guessLetter: string, targetLetter: string, target: string): ScoredLetter {
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

