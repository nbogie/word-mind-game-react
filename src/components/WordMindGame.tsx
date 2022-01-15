import React, { useCallback, useEffect, useState } from 'react';
import { GuessView, PlaceholderGuessView } from './GuessView';
import { Guess, LetterState, LetterStates } from '../types';
import { randomWord } from './wordList';
import Keyboard, { KeyboardKey } from './Keyboard';
import { ScoreCategory, ScoredLetter, scoreGuess } from '../scoring';

function WordMindGame() {
    const maxGuesses = 6;
    const [wordToGuess, setWordToGuess] = useState(randomWord());
    const [currentGuess, setCurrentGuess] = useState('');
    const [previousGuesses, setPreviousGuesses] = useState<Guess[]>([]);

    function resetGameWithNewWord() {
        setWordToGuess(randomWord());
        setCurrentGuess('');
        setPreviousGuesses([]);
    }

    function lastGuess() {
        return previousGuesses.length === 0 ? null : previousGuesses[previousGuesses.length - 1];
    }
    const turnsRemaining = maxGuesses - previousGuesses.length;
    const playerWon = () => lastGuess() === wordToGuess;
    const isGameOver = previousGuesses.length >= maxGuesses || playerWon();

    const letterStates = calcLetterStates(previousGuesses, wordToGuess);

    function handleBack() {
        setCurrentGuess(prev => prev.length === 0 ? prev : prev.slice(0, prev.length - 1));
    }

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

    const placeholderGuesses: null[] = isGameOver ? [] : [null, null, null, null, null].slice(0, turnsRemaining - 1);

    function NewGameButton() {
        return <button className='newGame' onClick={resetGameWithNewWord}>New Game</button>
    }
    return (

        <div className='wordMindGame'>
            <h2>A copy of Wordle - made with React</h2>

            {playerWon() && <><h3>You win!</h3><NewGameButton /></>}

            <div className={'guessRows'}>
                {previousGuesses.map((guess, ix) => <GuessView
                    guess={guess}
                    target={wordToGuess}
                    key={ix}
                />)}
                {!isGameOver && <div className='guessRow'>
                    {prepCurrentGuessForDisplay(currentGuess).map((letter, ix) => (
                        <div key={ix} className='unscoredLetter'>{letter}</div>
                    ))}
                </div>}
                {placeholderGuesses.map((junk, ix) => <PlaceholderGuessView
                    key={ix}
                />)}

                {isGameOver && !playerWon() && <><h3>Game Over.  The word was:</h3>
                    <div className='guessRow'>
                        {wordToGuess.split('').map((letter, ix) => (
                            <div key={ix} className='unscoredLetter'>{letter}</div>)
                        )}
                    </div>
                    <br />
                    <NewGameButton />
                </>
                }

            </div>
            <Keyboard
                letterStates={letterStates}
                handleLetterEntry={handleLetterEntry} />

            <h3>About the real Wordle</h3>
            <p>The real Wordle is better and can be found at<br />
                <a href='https://www.powerlanguage.co.uk/wordle/'>https://www.powerlanguage.co.uk/wordle/</a>
                <br />
                The version here is just for study purposes, though it does let you play multiple times per day!
            </p>
        </div >
    )
}
export default WordMindGame;

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
function prepCurrentGuessForDisplay(lettersSoFar: string): string[] {
    return padWithTrailingSpaces(lettersSoFar, 5).split('');

}

function padWithTrailingSpaces(str: string, targetLen: number): string {
    return str + ' '.repeat(5 - str.length);
}
