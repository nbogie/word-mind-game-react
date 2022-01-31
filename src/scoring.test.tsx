import { fail } from 'assert';
import { ScoreCategory, ScoredLetter, scoreGuess } from './scoring';

function checkScoring(guess: string, expectedScoreShorthand: string, target: string) {
    const res: ScoredLetter[] = scoreGuess(guess, target);
    type ShorthandChar = '0' | '1' | '2';
    const lookup: Record<ShorthandChar, ScoreCategory> = {
        '0': 'notInWord',
        '1': 'partial',
        '2': 'placed',
    }

    const shorthands = expectedScoreShorthand.split('');
    if (!shorthands.every(ch => ['0', '1', '2'].includes(ch))) {
        fail("expectedScore shorthand was invalid: " + expectedScoreShorthand);
    } else {
        const expected: ScoreCategory[] = (shorthands as ShorthandChar[]).map(digit => lookup[digit]);
        expect(res.map(s => s.score)).toEqual(expected);
    }
}

it("should score HOOPS 22001 for HOUSE",
    () => {
        checkScoring('HOOPS', '22001', 'HOUSE');
    }
);

it("should only mark ONE of a double letter as yellow in input when there's only ONE in target.  STEEP for HOUSE should be 10100",
    () => {
        checkScoring('STEEP', '10100', 'HOUSE');
    }
);


it("prioritises later green when processing first of a double letter in input",
    () => {
        checkScoring('LADLE', '01022', 'STALE');
    }
);

it("should mark a matching word correctly",
    () => {
        checkScoring("TRAIN", "22222", "TRAIN")
    }
);
it("should mark a matching word correctly with doubles",
    () => {
        checkScoring("CHESS", "22222", "CHESS")
    }
);

it("should score 00000 for a complete miss",
    () => {
        checkScoring("ABCDE", "00000", "TOUGH")
    }
);
