import { ScoreCategory, ScoredLetter } from "../scoring";

export interface ScoredLetterProps {
    scoredLetter: ScoredLetter;
}
export function ScoredLetterView(props: ScoredLetterProps) {
    return <div className={'scoredLetter ' + classForScore(props.scoredLetter.score)}>
        {props.scoredLetter.letter}</div>;
}
export function PlaceholderLetterView() {
    return <div className='placeholderLetter'>
    </ div>;
}
function classForScore(score: ScoreCategory): string {
    return score;
}
