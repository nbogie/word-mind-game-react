import { Guess } from "./types";

export type ScoreCategory = 'placed' | 'partial' | 'notInWord';
export interface ScoredLetter {
    letter: string;
    score: ScoreCategory;
}

export function scoreGuess(guess: Guess, target: string): ScoredLetter[] {

    interface TargetTileBeingMarked {
        letter: string;
        isAccountedFor: boolean;
    }

    interface MaybeScoredLetter {
        letter: string;
        score?: ScoreCategory;
    }
    //sweep 1: account for any greens first:
    //    for each letter guess-target pair that perfectly match
    //        mark the target letter tile as accounted for
    //        mark the guess letter tile as accounted for
    //sweep 2: deal with any yellows.
    //    for each GUESS_TILE of remaining tiles in guess
    //        if GUESS_TILE letter is in remaining unaccounted-for tiles in TARGET
    //        mark GUESS_TILE yellow
    //        mark TARGET_TILE accounted for    

    const guessTiles: MaybeScoredLetter[] = guess.split('').map(ch => ({ letter: ch }))
    const targetTiles: TargetTileBeingMarked[] = target.split('').map(ch => ({ letter: ch, isAccountedFor: false }))
    const alignedPairs = zip(guessTiles, targetTiles);
    const perfectMatches = alignedPairs.filter(([gTile, tTile]) => gTile.letter === tTile.letter);
    perfectMatches.forEach(([gTile, tTile]) => {
        gTile.score = 'placed'
        tTile.isAccountedFor = true;
    });

    const remainingGuessTiles = guessTiles.filter(gt => !gt.score);

    for (let guessTile of remainingGuessTiles) {
        const unmatchedTargetTiles = targetTiles.filter(tt => !tt.isAccountedFor);
        const foundTargetTile = unmatchedTargetTiles.find(tt => guessTile.letter === tt.letter);
        if (foundTargetTile) {
            guessTile.score = 'partial';
            foundTargetTile.isAccountedFor = true;
        } else {
            guessTile.score = 'notInWord';
        }
    }

    //TODO: better ts to ensure this type is correct
    return guessTiles.filter(gt => gt.score) as ScoredLetter[];
}

function zip<S, T>(arr1: S[], arr2: T[]): [S, T][] {
    return arr1.map((el, ix) => [el, arr2[ix]]);
}

