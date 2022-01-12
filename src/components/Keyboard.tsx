import { LetterStates } from "../types";

interface KeyboardProps {
    letterStates: LetterStates;
    handleLetterEntry: (k: string) => void;
}
export default function Keyboard(props: KeyboardProps) {
    const keysForRows: string[][] = ['ABCDEF', 'GHIJK', 'LMNOPQ', 'RSTUV', '1WXYZ2'].map(word => word.split(''));

    return <div className='keyboard'>

        {
            keysForRows.map((keysForRow: string[], ix) => (
                <div
                    className='keyboardRow'
                    key={ix}>
                    {keysForRow.map(k => (
                        <button
                            className={'keyboardKey ' + props.letterStates[k]}
                            key={k}
                            onClick={(ev) => props.handleLetterEntry(k)}>{k}</button>
                    ))}
                </div>
            ))
        }
    </div >;
}