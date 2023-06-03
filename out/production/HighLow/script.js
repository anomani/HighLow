
async function main() {
    let deck = [];
    let pile = [];
    let isPlayer1;
    let consecutiveGuesses = 0;
    let player1Score = 0;
    let player2Score = 0;
    let api;
    let pastCard;
    let currentCard;
    let imageUrl;


    const currentPlayerElement = document.getElementById("current-player");
    const higherButton = document.getElementById("higher");
    const lowerButton = document.getElementById("lower");
    const passButton = document.getElementById("pass");
    const currentCardElement = document.getElementById("current-card");
    const player1ScoreElement = document.getElementById("player1-score");
    const player2ScoreElement = document.getElementById("player2-score");
    const restartButton = document.getElementById("restart");
    const resultElement = document.getElementById("result");
    const startElement = document.getElementById('start');
    const consecGuessElement = document.getElementById('consec-guess')


    async function createGame() {

        //Setting all the field variables
        isPlayer1 = true;
        player1Score = 0;
        player2Score = 0;
        consecutiveGuesses = 0;
        currentPlayerElement.textContent = "Current Player: Player 1"
        player1ScoreElement.textContent = "Player 1 Score: 0"
        player2ScoreElement.textContent = "Player 2 Score: 0"
        currentPlayerElement.textContent = "Current Player: Player 1"
        resultElement.textContent = "Result: "
        consecGuessElement.textContent = "Consecutive Guess: 0"

        //Disabling/Setting the buttons
        higherButton.disabled = false;
        lowerButton.disabled = false;
        passButton.disabled = false;
        startElement.disabled = false;


        const temp = await createDeck()
        return temp
    }

    async function createDeck() {
        try {
            const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            const data = await response.json()
            console.log(data)
            return data.deck_id
        } catch (error) {
            console.log('Error:', error)
        }


    }


    function drawCard() {
        fetch(`https://deckofcardsapi.com/api/deck/${api}/draw/?count=1`)
            .then(response => response.json())
            .then(data => {
                imageUrl = data.cards[0].images.png;
                currentCardElement.src = imageUrl
                currentCard = convert(data.cards[0].value);
                pile.push(currentCard);

            })
            .catch(error => endGame());
        console.log("Draw" + pile)
        debugger;
    }
    // function drawCardGuess(isHigher) {
    //
    //     fetch(`https://deckofcardsapi.com/api/deck/${api}/draw/?count=1`)
    //         .then(response => response.json())
    //         .then(data => {
    //             imageUrl = data.cards[0].images.png;
    //             console.log(imageUrl)
    //             currentCardElement.src = imageUrl
    //             currentCard = convert(data.cards[0].value);
    //             console.log("Card Value:", currentCard);
    //             pile.push(currentCard);
    //             checkGuess(isHigher)
    //
    //         })
    //         .catch(error => endGame());
    //     console.log("Draw" + pile)
    // }
    //
    // function drawCardStart() {
    //     higherButton.disabled = false;
    //     lowerButton.disabled = false;
    //     passButton.disabled = false;
    //     fetch(`https://deckofcardsapi.com/api/deck/${api}/draw/?count=1`)
    //         .then(response => response.json())
    //         .then(data => {
    //             imageUrl = data.cards[0].images.png;
    //             currentCardElement.src = imageUrl
    //             currentCard = convert(data.cards[0].value);
    //             pile.push(currentCard);
    //
    //
    //         })
    //         .catch(error => endGame());
    //
    // }

    function convert(card) {
        if (card === "JACK") {
            return 11
        } else if (card === "KING") {
            return 12
        } else if (card === "QUEEN") {
            return 13
        } else if (card === "ACE") {
            return 14
        } else {
            return parseInt(card)
        }
    }

    function checkGuess(isHigher) {

        if ((isHigher && (pile[pile.length - 1] > pile[pile.length - 2]) ||
            (!isHigher && (pile[pile.length - 1] < pile[pile.length - 2])))) { //Guess is correct add card to pile
            consecutiveGuesses++
            resultElement.textContent = "Result: Correct!"
            consecGuessElement.textContent = "Consecutive Guess: " + consecutiveGuesses
        } else {//Guess is incorrect
            resultElement.textContent = "Result: Incorrect :("
            if (isPlayer1) {
                player1Score = player1Score + pile.length - 2
                player1ScoreElement.textContent = "Player 1 Score: " + player1Score
            } else {
                player2Score = player2Score + pile.length - 2
                player2ScoreElement.textContent = "Player 2 Score: " + player2Score
            }
            consecutiveGuesses = 0;
            consecGuessElement.textContent = "Consecutive Guess: 0"
            pile = [pile[pile.length - 1]]
        }
    }

    function pass() {
        if (consecutiveGuesses >= 3) {
            isPlayer1 = !isPlayer1;
            consecutiveGuesses = 0
        }
        if (isPlayer1) {
            currentPlayerElement.textContent = "Current Player: Player 1"
        } else {
            currentPlayerElement.textContent = "Current Player: Player 2"
        }
    }


    function endGame() {
        if (player1Score > player2Score) {
            resultElement.textContent = "Game Over! Player 2 Wins"
        } else if (player2Score > player1Score) {
            resultElement.textContent = "Game Over! Player 1 Wins"
        } else {
            resultElement.textContent = "Game Over! Tie"
        }

        higherButton.disabled = true;
        lowerButton.disabled = true;
        passButton.disabled = true;
        startElement.disabled = true;
    }


    higherButton.addEventListener('click', function () {
        drawCard();
        checkGuess(true);
    });

    lowerButton.addEventListener('click', function () {
        drawCard();
        checkGuess(false);
    });

    passButton.addEventListener('click', function () {
        pass();

    });
    restartButton.addEventListener('click', function () {
        createGame();
        drawCard()
    });
    startElement.addEventListener('click', function () {
        createGame();
        drawCard()
        startElement.disabled = true;
    })

    api = await createGame()
}

main()
