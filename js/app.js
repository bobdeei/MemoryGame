/*
 * Create a list that holds all of your cards
 */

// Select elements in .score-panel
const starsUl = document.querySelector('.stars');
const movesSpan = document.querySelector('.moves');
const secondSpan = document.querySelector('#seconds');
const minuteSpan = document.querySelector('#minutes');
const restartButton = document.querySelector('.restart');

// Select the deck
const ulDeck = document.querySelector('.deck');

// Select elements in .overlay
const congratsMessage = document.querySelector('.congrats');
const timePlayed = document.querySelector('.timePlayed');
const finalMoves = document.querySelector('.finalMoves');
const finalRating = document.querySelector('.scores');
const playAgain = document.querySelector('.playAgain');


// Select audio elements
const audioR = document.querySelector('audio[data-key="82"]');
const audioClick = document.querySelector('audio.click');

// Create cards array
let cardsName = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];

// Trying new icons from FontAwesome
cardsName = ['fab fa-angular', 'fab fa-vuejs', 'fab fa-react', 'fab fa-css3-alt', 'fab fa-html5', 'fas fa-code', 'fab fa-slack', 'fab fa-js-square', 'fab fa-angular', 'fab fa-vuejs', 'fab fa-react', 'fab fa-css3-alt', 'fab fa-html5', 'fas fa-code', 'fab fa-slack', 'fab fa-js-square'];
let cardsStack = [];

let movesCounter = 0;
let matched = 0;
let timesClick = 0;
let timerId;
let finalScores = 3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function renderShuffledCards(cardsArray) {
    let cardHTML = '';
    let counter = 1;
    // Shuffle to get new array of cards
    cardsArray = shuffle(cardsArray);

    // Accumulate new cards to cardHTML
    cardsArray.forEach(card => {
        cardHTML += `<li id="card${counter}" class="card"><i class="${card}"></i></li>`;
        counter++;
    });

    // Render new cards to 'ul'
    ulDeck.innerHTML = cardHTML;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function displayCards(card) {
    card.classList.add('open', 'show', 'flip');
}

function compareCards(card) {
    // Put new card to card stack if stack is empty
    if (cardsStack.length === 0) {
        cardsStack.push(card);
    }

    // Check cards'if to ignore pushing one same card twice
    if (cardsStack[0]) {
        if (cardsStack[0].id !== card.id) {
            cardsStack.push(card);
        }
    }

    //Compare if matched
    if (cardsStack.length === 2) {
        updateMoves();
        if (cardsStack[0].firstElementChild.className === cardsStack[1].firstElementChild.className) {
            cardsStack.forEach(openCard => {
                openCard.classList.add('match');
            });
            matched++;
            displayWinning();

            // Reset cards stack for the next use
            cardsStack = [];
        } else {
            // Add 'wrong' class to each card
            cardsStack.forEach(openCard => {
                openCard.classList.add('wrong');
            });

            // Wait for 500ms, show wrong animation and hide cards
            setTimeout(() => {
                cardsStack.forEach(openCard => {
                    openCard.classList.remove('open', 'show', 'wrong');
                });
                cardsStack = [];
            }, 500);
        }
    }
}

function updateMoves() {
    movesCounter++;

    // Update new move every increment
    movesSpan.innerHTML = movesCounter;
    starRating();
}

function starRating() {
    const starsUlChilren = starsUl.children;
    if (movesCounter === 10) {
        starsUlChilren[2].firstElementChild.className = 'fas fa-star-half';
        finalScores -= .5;
    } else if (movesCounter === 12) {
        starsUl.removeChild(starsUlChilren[2]);
        finalScores -= .5;
    } else if (movesCounter === 14) {
        starsUlChilren[1].firstElementChild.className = 'fas fa-star-half';
        finalScores -= .5;
    } else if (movesCounter == 16) {
        starsUl.removeChild(starsUlChilren[1]);
        finalScores -= .5;
    } else if (movesCounter == 18) {
        starsUlChilren[0].firstElementChild.className = 'fas fa-star-half';
        finalScores -= .5;
    }
}

function timer() {
    if (timesClick === 1) {
        let seconds = 0;
        let minutes = 0;

        minuteSpan.textContent = '00';
        secondSpan.textContent = '00';

        const timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
                
                // Reformat the minute
                if (minutes < 10) {
                    minutes = `0${minutes}`;
                }
                minuteSpan.textContent = minutes;
            }

            // Reformat the second
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            secondSpan.textContent = seconds;
        }, 1000);

        timerId = timerInterval;
    }
}

function stopTimer() {
    clearInterval(timerId);
}

function reload() {
    window.location.reload();
}

function restartButtonListener() {
    restartButton.addEventListener('click', reload);
}

function playAgainButton() {
    playAgain.addEventListener('click', reload);
}

function hotKeyR() {
    window.addEventListener('keydown', e => {
        // Ignore the rest of the code if R not pressed
        if (e.keyCode !== 82) {
            return;
        }

        // Reset play time and play the sound
        audioR.currentTime = 0;
        audioR.play();

        window.location.reload();
    });
}

function displayWinning() {
    if (matched === 2) {
        // Stop timing to get seconds and minutes data
        stopTimer();

        // Get seconds and minutes value
        let secondValue = secondSpan.textContent;
        let minuteValue = minuteSpan.textContent;

        // Reformat seconds to display winning popup
        if (secondValue < 10) {
            if (secondValue === '00') {
                secondValue = `0 seconds`;
            } else if (secondValue === '01') {
                secondValue = `${secondValue[1]} second`;
            } else {
                secondValue = `${secondValue[1]} seconds`;
            }
        } else {
            secondValue = `${secondValue} seconds`;
        }

        // Reformat minutes to display winning popup
        if (minuteValue < 10) {
            if (minuteValue === '00') {
                minuteValue = '';
            } else if (minuteValue === '01') {
                minuteValue = `${minuteValue[1]} minute and`;
            } else {
                minuteValue = `${minuteValue[1]} minutes and`;
            }
        } else {
            minuteValue = `${minuteValue} minutes and`;
        }
    
        // Winning message
        congratsMessage.textContent = `Congratulation! You have won the game!`
        timePlayed.textContent = `Time played: ${minuteValue} ${secondValue}`;
        finalMoves.textContent = `Moves: ${movesCounter}`;
        finalRating.innerHTML = `Your Final Score: ${finalScores}`;

        // Display the popup
        setTimeout(() => document.querySelector('.overlay').style.height = '100%', 1000);
    }
    return;
}

function initialLoading() {
    restartButtonListener();
    renderShuffledCards(cardsName);
    playAgainButton();
    hotKeyR();

    ulDeck.addEventListener('click', e => {
        timesClick++;
        timer();
    
        if (e.target.nodeName !== 'LI') {
            return;
        }

        const card = e.target;
        
        displayCards(card);
        compareCards(card);
    });
}

initialLoading();