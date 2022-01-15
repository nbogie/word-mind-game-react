import React, { useCallback, useEffect, useState } from 'react';
import { Guess, LetterState, LetterStates } from '../types';
import { GuessRow, PlaceholderGuessRow } from './GuessRow';
import { randomWord } from './wordList';
import Keyboard, { KeyboardKey } from './Keyboard';
import { ScoreCategory, ScoredLetter, scoreGuess } from '../scoring';
import { Footer } from './Footer';
import CurrentRow from './CurrentRow';
import RevealedRow from './RevealedRow';

function WordMindGame() {
    const maxGuesses = 6;
    const [wordToGuess, setWordToGuess] = useState(randomWord());
    const [currentGuess, setCurrentGuess] = useState('');
    const [previousGuesses, setPreviousGuesses] = useState<Guess[]>([]);

    const handleSubmit = useCallback(() => {
        if (currentGuess.length !== 5) {
            return;
        }
        // if (!isInBiggerWordList(currentGuess)) {
        //     console.log('Unrecognised word: ', currentGuess);
        //     //TODO: tell user unrecognised word
        //     return;
        // }
        if (previousGuesses.length < maxGuesses) {
            previousGuesses.push(currentGuess);
            setCurrentGuess("");

        }
    }, [currentGuess, previousGuesses])


    const handleLetterEntry = useCallback(function (key: KeyboardKey) {
        if (key.type === 'special' && key.effect === 'Enter') {
            handleSubmit();
            return;
        }
        if (key.type === 'special' && key.effect === 'Backspace') {
            handleBack();
            return;
        }
        if (key.type === 'letter') {
            const upcased = key.letter.toUpperCase();
            if (upcased.match(/^[ABCDEFGHIJKLMNOPQRSTUVWXYZ]$/)) {
                if (currentGuess.length < 5) {
                    setCurrentGuess(g => g + upcased)
                }
            }
        }

    }, [currentGuess, handleSubmit]);



    useEffect(() => {
        const listener = (e: KeyboardEvent) => (e.key === 'Enter' || e.key === 'Backspace') ?
            handleLetterEntry({ type: 'special', display: e.key, effect: e.key }) :
            handleLetterEntry({ type: 'letter', letter: e.key });

        function registerKeyListener() {
            //keydown, not keypress - no backspace event.
            window.addEventListener('keydown', listener);
        }
        registerKeyListener();

        return () => window.removeEventListener('keydown', listener);
    }, [handleLetterEntry]);

    function resetGameWithNewWord() {
        setWordToGuess(randomWord());
        setCurrentGuess('');
        setPreviousGuesses([]);
    }

    function lastGuess() {
        return previousGuesses.length === 0 ? null : previousGuesses[previousGuesses.length - 1];
    }


    function calcLetterStates(prevGuesses: string[], target: string): LetterStates {

        function findBestScoreForLetter(letter: string, allScores: ScoredLetter[]): ScoreCategory {
            const scoresForLetter = allScores.filter((s: ScoredLetter) => s.letter === letter);
            scoresForLetter.sort().reverse();
            const bestScore: ScoreCategory = scoresForLetter[0]?.score;
            return bestScore;
        }
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const entries: [string, LetterState][] = alphabet.map(a => [a, 'untried']);
        const letterStates: LetterStates = Object.fromEntries(entries);
        const scorings: ScoredLetter[] = prevGuesses.flatMap(guess => scoreGuess(guess, target));

        const triedLetters = prevGuesses.join('');

        for (const letter of triedLetters) {
            const best = findBestScoreForLetter(letter, scorings);
            letterStates[letter] = best;
        }
        return letterStates;
    }

    function handleBack() {
        setCurrentGuess(prev => prev.length === 0 ? prev : prev.slice(0, prev.length - 1));
    }


    const turnsRemaining = maxGuesses - previousGuesses.length;
    const playerWon = () => lastGuess() === wordToGuess;
    const isGameOver = previousGuesses.length >= maxGuesses || playerWon();
    const letterStates = calcLetterStates(previousGuesses, wordToGuess);
    const placeholderGuesses: null[] = isGameOver ? [] : [null, null, null, null, null].slice(0, turnsRemaining - 1);

    function NewGameButton() {
        return (
            <button className='newGame' onClick={resetGameWithNewWord}>
                New Game
            </button>
        )
    }

    return (
        <div className='wordMindGame'>

            {playerWon() && <><h3>You win!</h3><NewGameButton /></>}

            <div className={'guessRows'}>
                {previousGuesses.map((guess, ix) => (
                    <GuessRow
                        guess={guess}
                        target={wordToGuess}
                        key={ix}
                    />
                ))}

                {!isGameOver && <CurrentRow currentGuess={currentGuess} />}

                {placeholderGuesses.map((junk, ix) => <PlaceholderGuessRow
                    key={ix}
                />)}

                {isGameOver && !playerWon() && <>
                    <h3>Game Over.  The word was:</h3>
                    <RevealedRow wordToGuess={wordToGuess} />
                    <br />
                    <NewGameButton />
                </>
                }
            </div
            >
            <Keyboard
                letterStates={letterStates}
                handleLetterEntry={handleLetterEntry} />
            <Footer />
        </div >
    )
}
export default WordMindGame;
