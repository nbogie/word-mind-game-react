import { LetterStates } from "../types";

interface KeyboardProps {
    letterStates: LetterStates;
    handleLetterEntry: (k: KeyboardKey) => void;
}
type SpecialKey = {
    type: 'special',
    display: string,
    effect: 'Enter' | 'Backspace'
};
type LetterKey = { type: 'letter', letter: string };
export type KeyboardKey = LetterKey | SpecialKey;

export default function Keyboard(props: KeyboardProps) {

    function makeKey(shorthand: string): KeyboardKey {
        if (shorthand === '1') {
            return { type: 'special', display: 'Enter', effect: 'Enter' };
        }
        if (shorthand === '2') {
            return { type: 'special', display: 'DEL', effect: 'Backspace' };
        }
        return { type: 'letter', letter: shorthand };
    }

    function keyToString(k: KeyboardKey): string {
        return k.type === 'letter' ? k.letter : k.display;
    }

    const keysForRows: KeyboardKey[][] = ['ABCDEF', 'GHIJK', 'LMNOPQ', 'RSTUV', '1WXYZ2'].map(w => w.split('').map(makeKey));

    return <div className='keyboard'>

        {
            keysForRows.map((keysForRow: KeyboardKey[], ix) => (
                <div
                    className='keyboardRow'
                    key={ix}>
                    {keysForRow.map(k => (
                        <button
                            className={'keyboardKey ' + (k.type === 'letter' ? props.letterStates[k.letter] : 'special')}
                            key={k.type === 'letter' ? k.letter : k.display}
                            onClick={(ev) => props.handleLetterEntry(k)}>
                            {keyToString(k)}
                        </button>
                    ))}
                </div>
            ))
        }
    </div >;
}