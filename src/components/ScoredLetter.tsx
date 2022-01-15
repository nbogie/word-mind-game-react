import { motion } from "framer-motion";
import { ScoreCategory, ScoredLetter } from "../scoring";

export interface ScoredLetterProps {
    scoredLetter: ScoredLetter;
}
export function ScoredLetterView(props: ScoredLetterProps) {

    const variants = {
        initial: {
            rotateY: 90
        },
        animate: {
            rotateY: 0
        }
    }

    return (
        <motion.div variants={variants}>
            <div className={'scoredLetter ' + classForScore(props.scoredLetter.score)}>
                {props.scoredLetter.letter}
            </div>
        </motion.div>
    );
}
export function PlaceholderLetterView() {
    return <div className='placeholderLetter'>
    </ div>;
}
function classForScore(score: ScoreCategory): string {
    return score;
}
