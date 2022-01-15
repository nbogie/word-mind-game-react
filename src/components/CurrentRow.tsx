interface CurrentRowProps {
    currentGuess: string;
}

function CurrentRow(props: CurrentRowProps) {
    function prepCurrentGuessForDisplay(lettersSoFar: string): string[] {
        return padWithTrailingSpaces(lettersSoFar, 5).split('');
    }

    function padWithTrailingSpaces(str: string, targetLen: number): string {
        return str + ' '.repeat(5 - str.length);
    }

    return (
        <div className='guessRow'>
            {prepCurrentGuessForDisplay(props.currentGuess).map((letter, ix) => (
                <div key={ix} className='unscoredLetter'>{letter}</div>
            ))}
        </div>
    )
}
export default CurrentRow;