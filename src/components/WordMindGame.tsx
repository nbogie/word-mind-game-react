import React, { useCallback, useEffect, useState } from 'react';
import { GuessView } from './GuessView';
import { Guess } from '../types';
import { randomWord } from './wordList';

function WordMindGame() {
    const maxGuesses = 6;
    const [wordToGuess,] = useState(randomWord());

    const [currentGuess, setCurrentGuess] = useState('');
    const [previousGuesses,] = useState<Guess[]>([]);

    function lastGuess() {
        return previousGuesses.length === 0 ? null : previousGuesses[previousGuesses.length - 1];
    }
    const turnsRemaining = maxGuesses - previousGuesses.length;
    const playerWon = () => lastGuess() === wordToGuess;
    const isGameOver = previousGuesses.length >= maxGuesses || playerWon();

    function handleClear() {
        setCurrentGuess("");
    }

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

    const handleAnswerChange = useCallback(function (key: string) {
        if (key === 'Enter') {
            handleSubmit();
            return;
        }
        // You don't get a key of Backspace with 'keypress' event, 
        // unlike with 'keydown'
        if (key === 'Backspace') {
            handleBack();
            return;
        }
        if (key) {
            const upcased = key.toUpperCase();
            if (upcased.match(/^[ABCDEFGHIJKLMNOPQRSTUVWXYZ]$/)) {
                if (currentGuess.length < 5) {
                    setCurrentGuess(g => g + upcased)
                }
            }
        }
    }, [currentGuess, handleSubmit]);

    useEffect(() => {
        const listener = (e: any) => handleAnswerChange(e.key);
        function registerKeyListener() {
            window.addEventListener('keydown', listener);
        }
        registerKeyListener();

        return () => window.removeEventListener('keydown', listener);
    }, [handleAnswerChange]);

    return (

        <div className='wordMindGame'>
            <h2>A copy of Wordle - made with React</h2>
            {playerWon() && <h3>You win!</h3>}
            {
                !isGameOver &&
                <>
                    <div className='controls'>
                        <button onClick={handleClear} >Clear</button>
                        <button onClick={handleBack} >Back</button>
                        <button onClick={handleSubmit} >Submit</button>
                        <br />
                    </div>
                    <div className='guessRow'>
                        {currentGuess.split('').map((letter, ix) => <div key={ix} className='unscoredLetter'>{letter}</div>)}
                    </div>
                    Turns remaining: {turnsRemaining}
                </>
            }
            <br />
            Prev guesses:
            <div className={'previousGuesses'}>
                {previousGuesses.map((guess, ix) => <GuessView
                    guess={guess}
                    target={wordToGuess}
                    key={ix}
                />)}
            </div>
            <h3>Controls</h3>
            <p>Type letters to add to guess<br />
                Type 'Enter' to submit a guess<br />
                Type backspace to remove a character</p>

            <h3>About Wordle</h3>
            <p>The real Wordle is better and can be found at<br />
                <a href='https://www.powerlanguage.co.uk/wordle/'>https://www.powerlanguage.co.uk/wordle/</a>
                <br />
                The version here is just for study purposes.
            </p>
        </div >
    )
}
export default WordMindGame;
