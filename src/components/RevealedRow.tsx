interface RevealedRowProps {
    wordToGuess: string;
}
function RevealedRow(props: RevealedRowProps) {
    return (
        <div className='guessRow'>
            {props.wordToGuess.split('').map((letter, ix) => (
                <div key={ix} className='unscoredLetter' >
                    {letter}
                </div>)
            )}
        </div>

    )
}
export default RevealedRow;