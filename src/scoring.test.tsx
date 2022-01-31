import { fail } from 'assert';
import { ScoreCategory, ScoredLetter, scoreGuess } from './scoring';


it("should score HOOPS 22001 for HOUSE",
    () => {

        expect(scoreGuess('HOOPS', 'HOUSE')).toMatchShorthand('22001');
    }
);

it("should only mark ONE of a double letter as yellow in input when there's only ONE in target.  STEEP for HOUSE should be 10100",
    () => {
        expect(scoreGuess('STEEP', 'HOUSE')).toMatchShorthand('10100');
    }
);


it("prioritises later green when processing first of a double letter in input",
    () => {
        expect(scoreGuess('LADLE', 'STALE')).toMatchShorthand('01022');
    }
);
it("should mark a single guessed letter correctly that occurs twice in the target",
    () => {
        expect(scoreGuess("TREAT", "EJECT")).toMatchShorthand("00202");
    }
);

it("should mark a matching word correctly",
    () => {
        expect(scoreGuess("TRAIN", "TRAIN")).toMatchShorthand("22222");
    }
);
it("should mark a matching word correctly with doubles",
    () => {
        expect(scoreGuess("CHESS", "CHESS")).toMatchShorthand("22222");
    }
);

it("should score 00000 for a complete miss",
    () => {
        expect(scoreGuess("ABCDE", "TOUGH")).toMatchShorthand("00000");
    }
);


expect.extend({
    toMatchShorthand(result: ScoredLetter[], expectedScoreShorthand: string) {

        type ShorthandChar = '0' | '1' | '2';
        const lookup: Record<ShorthandChar, ScoreCategory> = {
            '0': 'notInWord',
            '1': 'partial',
            '2': 'placed',
        }

        function scoredLetterToString(sl: ScoredLetter) {
            return sl.letter + ":" + sl.score;
        }

        function findKeyByValue(value: ScoreCategory, object: Record<ShorthandChar, ScoreCategory>): ShorthandChar {
            const answer = Object.keys(object).map(s => s as ShorthandChar).find(key => object[key] === value);
            if (!answer) {
                throw new Error("missing ScoreCategory " + value + " in lookup: " + lookup);
            }
            return answer;
        }

        const resultAsLongString = result.map(scoredLetterToString);
        const resultShorthand = result.map(v => findKeyByValue(v.score, lookup)).join('');
        const expectedIsValidShorthand = expectedScoreShorthand.split('').every(ch => ['0', '1', '2'].includes(ch));

        if (!expectedIsValidShorthand) {
            return {
                message: () =>
                    "expectedScore shorthand was invalid: " + expectedScoreShorthand,
                pass: false,
            };
        } else {
            const expected: ScoreCategory[] = (expectedScoreShorthand.split('') as ShorthandChar[]).map(digit => lookup[digit]);

            if (this.equals(result.map(s => s.score), expected)) {
                return {
                    message: () =>
                        `expected score ${resultShorthand} to be ${expectedScoreShorthand}`,
                    pass: true,
                };
            } else {
                return {
                    message: () =>
                        `expected score ${resultShorthand} to be ${expectedScoreShorthand}.  Full actual value: (${resultAsLongString})`,
                    pass: false,
                };

            }
        }
    }
})