import { ScoreCategory, ScoredLetter, scoreGuess } from './scoring';

it.skip("prioritises later green when processing first of a double letter in input",
    () => {
        const res: ScoredLetter[] = scoreGuess("LADLE", "STALE");
        const expected: ScoreCategory[] = [
            'notInWord',
            'partial',
            'notInWord',
            'placed',
            'placed'
        ]
        expect(res.map(s => s.score)).toEqual(expected);
    });