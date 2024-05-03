// adapted from github link: https://github.com/doroshm/BlackJack

// Main Changes/Adaptions: 
// -made a draw card function for dealer and player, Deal() and Draw() respectively
// -combined the reducedealer and reduceplayer function because they were similar and redundant
// -Reordered functions, added special cases, and changed timings to realistically replicate a black jack game
// -refactored functions to be more accurate with their name and actual uses
// -ommitted sound volumes
// -used promises to do input validation
// -added a double down feature, to allow for more realistic gameplay
// -combined files to allow for less folder clutter
// -renamed some variables for readablity
// -changed betting system to align with rest of website
// -changed inputs and outputs of elements to align with html and website flow
// -Made major style changes to flow better with style of full site, like button hovers, layout, and colors

// INTIALIZE GLOBAL VARIABLES (hence var instead of let)
var dealerSum = 0;
var yourSum = 0;
var numCards = 0;

var dealerAceCount = 0;
var yourAceCount = 0; //A, 2 -> 11 + 2 + 10 or 1 + 2 + 10
// need to keep track of # of aces in hand so we know how many times to subtract 10 if sum > 21

var hidden; // dealer starts with 1 hidden card, 1 visible
var deck;
var canHit = false; //allows the player (you) to draw while yourSum <= 21
var blackjack = false;
var doubleDown = false;
var push = false;

var balance = 100;
var betAmount;
var playerWins = false;

window.onload = function() { //on load, hide restart button, eventlistener for start button
  document.getElementById("restart").style.display = "none";
  document.getElementById("start").addEventListener("click", () => {
    restartGame();
  });
}

function bet() { // takes in bet and input validation
  document.getElementById("stay").disabled = true;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      betAmount = document.getElementById('betAmount');
      betAmount = parseFloat(betAmount.value);

      if (isNaN(betAmount) || betAmount <= 0) {
        alert("Invalid bet amount. Please enter a valid positive number.");
        reject("Invalid bet amount.");
      } else if (betAmount > balance) {
        alert("Insufficient balance. Please bet an amount within your current balance.");
        reject("Insufficient balance.");
      } else {
        balance -= betAmount;
        document.getElementById('balance').textContent = `Balance: ${balance} credits`;
        resolve(betAmount);
      }
    }, 100);
  })

    .then((validInput) => {
      document.getElementById("start").style.display = "none";
      document.getElementById("restart").style.display = "inline-block";
      startGame();
    }).catch((error) => {
      console.error(error);
    });
}

function initDeck() { // init deck using 2 for loops and string concatenation
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q" ,"K"]; // RANKS
  let types = ["C", "D", "H", "S"]; // SUITS: clubs, diamonds, hearts, 
  deck = []; // DECK array

  for (let i=0; i < types.length; i++) {
    for (let j=0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]); // loop thru all cards by suit 
      // A-C -> K-C (all clubs), A-D -> K-D (all diamonds), and so on

    }
  }
  // console.log(deck);
}

function shuffleDeck() { // goes through every card and switches
  for (let i=0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // [0,1] * 52 => (0,51.9999) 0-indexed
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log("This is the shuffled deck")
  console.log(deck);
}

function Deal() { // specifically hardcoded drawing function for dealer,, do not get confused with "DEAL" button
  let cardImg = document.createElement("img") //create <img> tag to represent drawing a card
  let card = deck.pop(); // draw card
  // set the src image to that card's image
  cardImg.src = "./cards/" + card + ".png"; // this works bc the images are named exactly how they are initialized in initDeck()
  dealerSum += getValue(card); //update dealers running sum
  dealerAceCount += checkAce(card); //update ace count if card is an ace
  setTimeout(() => {
    document.getElementById("dealerCards").append(cardImg); // add the card's image to the dealerCards container in the .html
  }, 300)
  document.getElementById("dealerSum").innerText = reduceAce(dealerSum, dealerAceCount)-getValue(hidden);
}

function Draw() { // same as Deal but for the player (you)
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  setTimeout(() => {
    document.getElementById("yourCards").append(cardImg); // add the card's image to the dealerCards container in the .html
  }, 100)
  numCards++;
  document.getElementById("yourSum").innerText = reduceAce(yourSum, yourAceCount);
}

// start game function to start dealing cards
function startGame() {
  hidden = deck.pop(); //  removes card from end of array, deal to dealer first card, but make sure it remains hidden
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  document.getElementById("stay").disabled = false;

  setTimeout(() => {
    Draw();
  }, 300)
  setTimeout(() => {
    Deal();
  }, 600)
  setTimeout(() => {
    Draw();
  }, 900)

  setTimeout(() => { // so ample time is given for sums to calculate from drawing ^^^
    if (dealerSum == 21 || yourSum == 21) {
      blackjack = true;
      flipHidden();
    
      if (dealerSum == yourSum) {
        document.getElementById("results").innerText = "Push! (Tie)";
        push = true;
      } else if (dealerSum == 21) {
        document.getElementById("results").innerText = "Blackjack! You Lose!";
      } else {
        document.getElementById("results").innerText = "Blackjack! You Win!";
        playerWins = true;
      }
      
      // update sums
      document.getElementById("yourSum").innerText = yourSum;
      document.getElementById("dealerSum").innerText = dealerSum;
      
      // Payouts
      if (playerWins) { // player wins
        let winnings = (blackjack) ? betAmount * 1.5 : betAmount * 2; // blackjack pays 3:2 others pay 1:1
        console.log(`Congratulations! You win ${winnings} credits.`);
        balance += winnings; // Add winnings to balance
        document.getElementById('winnings').textContent = `Congratulations! You win ${winnings} credits.`;
      } else { // player loses
        console.log("Sorry, you lose.");
      }
      document.getElementById('balance').textContent = `Balance: ${balance} credits`;

      // Disable buttons
      document.getElementById("hit").disabled = true;
      document.getElementById("stay").disabled = true;
      document.getElementById("double").disabled = true;
    
      return; // End the game
    }
    canHit = true; // player is allowed to hit now that game has started
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("double").addEventListener("click", double);
    document.getElementById("restart").addEventListener("click", restartGame);

  }, 1200)
}

function hit() { // draw card function for player
  if (!canHit) {
    return;
  }

  // if canHit, give yourself a card
  Draw();

  // case: player busts first
  if (reduceAce(yourSum, yourAceCount) > 21) { // A,J,K -> 11 + 10 + 10 = 31 or 1 + 10 + 10 = 21
    canHit = false;
    let message = "Bust! You Lose!"
    document.getElementById("results").innerText = message;
    document.getElementById("dealerSum").innerText = reduceAce(dealerSum, dealerAceCount);
    document.getElementById("yourSum").innerText = reduceAce(yourSum, yourAceCount);
    
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"; // reveal dealer's hidden card

    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
    
  } else if (reduceAce(yourSum, yourAceCount) == 21) { // if player reaches 21, move on to dealer's turn by calling stay()
    stay();
  }
}

function stay() { // player keeps hand, what happens when it's Dealer's turn
  if (!numCards >= 2) { // prevents player from calling stay after invalid input
    return;
  }
  
  // total both sums
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false; // not allowed to hit after deciding to stay

  flipHidden();

  setTimeout(() => {
    // Check for Dealer Blackjack case
    if (dealerSum == 21) {
      let message = "Blackjack! You Lose!"
      document.getElementById("results").innerText = message;
      return; // end the game if blackjack is achieved
    }
    
    // DEALER'S TURN
    // Dealer ontinues to hit until >= 17
    while (dealerSum < 17) {
      Deal();
      document.getElementById("dealerSum").innerText = dealerSum;
    }
    // result messages
    let message = "";
    if (yourSum > 21) {
      message = "Bust! You Lose!";
    }
    else if (dealerSum > 21) {
      message = "Dealer Busts! You win!";
      playerWins = true;
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
      message = "Push! (Tie)";
      push = true;
    }
    else if (yourSum > dealerSum) {
      message = "You Win!";
      playerWins = true;
    }
    else if (yourSum < dealerSum) {
      message = "You Lose!";
    }
    // Payouts
    if (playerWins) { // player wins
      let winnings = (doubleDown) ? betAmount * 4 : betAmount * 2; // doubledowwn 2:1 others pay 1:1
      console.log(`Congratulations! You win ${winnings} credits.`);
      balance += winnings; // Add winnings to balance
      document.getElementById('winnings').textContent = `Congratulations! You win ${winnings} credits.`;
    } else if (push) {
      balance += betAmount;
    } else { // player loses
      console.log("Sorry, you lose/pushed.");
    }
    document.getElementById('balance').textContent = `Balance: ${balance} credits`;
    document.getElementById("dealerSum").innerText = dealerSum;
    document.getElementById("yourSum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
  }, 400)
}

function getValue(card) { // returns the value of the card
  let data = card.split("-"); // e.g. "4-C" calling split on "-" splits the values into 2, ["4", "C"]
  let value = data[0];
  
  if (isNaN(value)) { // if this card is a face card or Ace (NaN = not a number)
    if (value == "A"){
      return 11; // ace, return 11
    }
    return 10; // face card, return 10
  }
  return parseInt(value); // else return value of the number card
}

function checkAce(card) { // return 1 if ace, else 0
  if (card[0] == "A") {
    return 1;
  } 
  return 0;
}

function reduceAce(playerSum, playerAceCount) { // only reduces by 1 ace at a time
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function restartGame() { // restarts the game and resets all variables
  // document.getElementById("start").style.display = "none";
  dealerSum = 0;
  yourSum = 0;
  dealerAceCount = 0;
  yourAceCount = 0;
  canHit = false;
  numCards = 0;
  blackjack = false;
  playerWins = false;
  betAmount = 0;
  doubleDown = false;
  push = false;
  // Clear dealer and player cards
  document.getElementById("dealerCards").innerHTML = '<img id="hidden" src="./cards/BACK.png">';
  document.getElementById("yourCards").innerHTML = "";
  document.getElementById("dealerSum").innerText = "";
  document.getElementById("yourSum").innerText = "";
  document.getElementById("results").innerText = "";
  document.getElementById("winnings").innerText = "";
  document.getElementById("hit").disabled = false;
  document.getElementById("stay").disabled = false;
  document.getElementById("double").disabled = false;
  initDeck(); // 2 for loops to loop through all 52 cards
  shuffleDeck(); // need to shuffle or else cards will be in order as it loops thru ranks and suits
  bet();
}

function double() { // doubles the original bet on current hand, but can only hit once
  if (numCards != 2) { // should only be able to double down if player hasn't hit yet & player has enough credits
    return;
  }
  doubleDown = true;

  if (betAmount > balance) {
    alert("Insufficient balance. Please bet an amount within your current balance.");
    return;
  }//input validation
  balance -= betAmount; //deduct bet from balance
  document.getElementById('balance').textContent = `Balance: ${balance} credits`;
  
  Draw();

  if (reduceAce(yourSum, yourAceCount) > 21) { // A,J,K -> 11 + 10 + 10 = 31 or 1 + 10 + 10 = 21
    canHit = false;
    let message = "Bust! You Lose!";
    document.getElementById("results").innerText = message;
    document.getElementById("dealerSum").innerText = dealerSum;
    document.getElementById("yourSum").innerText = yourSum;
    
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"; // reveal dealer's hidden card

    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
    stay();
  }
  stay();
}

function flipHidden() { // flips the dealer's hidden card at the end of the game
  document.getElementById("hidden").classList.add('flip'); 
  setTimeout(() => {
    document.getElementById("hidden").classList.remove('flip'); 
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"; // hidden was set to a card, now reveal it
  }, 500)
}