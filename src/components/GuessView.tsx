import { ScoredLetterView } from "./ScoredLetter";
import { Guess } from "../types";
import { scoreGuess } from "../scoring";

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

