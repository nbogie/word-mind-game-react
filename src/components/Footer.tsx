import React from 'react';

export function Footer() {
    return (
        <>
            <h3>This is not the real Wordle</h3>
            <div>The real Wordle is better and can be found at<br />
                <a href='https://www.powerlanguage.co.uk/wordle/'>https://www.powerlanguage.co.uk/wordle/</a>
                <br />
                <br />
                The version here is just for a programming study, though it does let you play multiple times per day!
                <br />
                <br />
                <strong>Known limitations of this version:</strong>
                <br />
                1. If you reload this page you will lose your game-in-progress and a new target word will be generated.
                <br />
                2. The words you submit are not checked as being legal dictionary words. (You'll have to keep yourself honest!)
            </div>
        </>
    );
}
