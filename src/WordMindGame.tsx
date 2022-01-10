import React, { useCallback, useEffect, useState } from 'react';
import { GuessView } from './GuessView';
import { Guess } from './types';
import { isInBiggerWordList, randomWord } from './wordList';

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

    function handleSubmit() {
        if (currentGuess.length !== 5) {
            return;
        }
        if (!isInBiggerWordList(currentGuess)) {
            console.log('unrecognised word: ', currentGuess);
            //TODO: tell user unrecognised word
            return;
        }
        if (previousGuesses.length < maxGuesses) {
            previousGuesses.push([...currentGuess.split('')].join(''));
            setCurrentGuess("");

        }
    }

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
    }, [currentGuess]);

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
            <h2>A game like Wordle</h2>
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
            <p>The real Wordle can be found at<br />
                <a href='https://www.powerlanguage.co.uk/wordle/'>https://www.powerlanguage.co.uk/wordle/</a>
            </p>
        </div >
    )
}
export default WordMindGame;
