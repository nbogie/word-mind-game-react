import { PlaceholderLetterView, ScoredLetterView } from "./ScoredLetter";
import { Guess } from "../types";
import { scoreGuess } from "../scoring";
import { motion } from 'framer-motion';

interface GuessViewProps {
    guess: Guess;
    target: string;
}

export function GuessView(props: GuessViewProps) {
    const cells = scoreGuess(props.guess, props.target);

    const variants = {
        container: {
            animate: {
                transition: {
                    staggerChildren: 0.3
                }
            }
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={variants.container}
        >
            <div className='guessRow'>
                {cells.map((scoredLetter, ix) => <ScoredLetterView
                    scoredLetter={scoredLetter}
                    key={ix} />)}
            </div>
        </motion.div>
    );
}

export function PlaceholderGuessView() {
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

