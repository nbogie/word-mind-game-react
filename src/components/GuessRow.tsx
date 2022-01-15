import { PlaceholderLetterView, ScoredLetterView } from "./ScoredLetter";
import { Guess } from "../types";
import { scoreGuess } from "../scoring";

interface GuessRowProps {
    guess: Guess;
    target: string;
}

export function GuessRow(props: GuessRowProps) {
    const cells = scoreGuess(props.guess, props.target);

    return (
        <div className='guessRow'>
            {cells.map((scoredLetter, ix) => <ScoredLetterView
                scoredLetter={scoredLetter}
                key={ix} />)}
        </div>
    );
}

export function PlaceholderGuessRow() {
    const cells = new Array(5).fill('x');

    return (
        <div className='guessRow placeholderRow'>
            {cells.map((junk, ix) => (
                <PlaceholderLetterView
                    key={ix} />)
            )}
        </div>
    );
}

