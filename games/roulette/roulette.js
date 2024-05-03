let balance = 100; //starting balance
//Randomly chooses 0-36
function spinWheel() {
    return Math.floor(Math.random() * 37);
}
//checks if even
function isEven(number) {
    return number % 2 === 0;
}
//checks what color the rolled number represents
function getColor(number) {
    if (number === 0) {
        return 'green';
    } else if (number >= 1 && number <= 10) {
        return (number % 2 === 0) ? 'black' : 'red';
    } else if (number >= 11 && number <= 18) {
        return (number % 2 === 0) ? 'red' : 'black';
    } else {
        return (number % 2 === 0) ? 'black' : 'red';
    }
}
//main engine to handle input and roll
document.getElementById("button").addEventListener("click", function () {
    let betType = document.getElementById('betType');//pulls betType from html input
    betType = betType.value.trim().toLowerCase();
    let wheelImg = document.getElementById('rouletteWheel');

    if (betType !== 'red' && betType !== 'black' && betType !== 'even' && betType !== 'odd' && betType !== 'green') {
        alert("Invalid bet type. Please choose 'red', 'black', 'even', 'odd', or 'green'.");
        return;
    }//input validation

    let betAmount = document.getElementById('betAmount');//pulls betAmount from html input
    betAmount = parseInt(betAmount.value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Invalid bet amount. Please enter a valid positive number.");
        return;
    }//input validation
    if (betAmount > balance) {
        alert("Insufficient balance. Please bet an amount within your current balance.");
        return;
    }//input validation
    balance -= betAmount; //deduct bet from balance
    document.getElementById('balance').textContent = `Balance: ${balance} credits`;
    document.getElementById('balance').texted = true; //disables button while animation is going
    let result = spinWheel();
    let resultColor = getColor(result);
    document.getElementById('button').disabled = true;

    let spinDuration = 4000 //wheel spins for 4 seconds

    wheelImg.style.transition = `transform ${spinDuration / 1000}s ease-in-out`; //allows rotation animation to accelerate and deccelerate
    wheelImg.style.transform = `rotate(1500deg)`; //rotates 1500 degrees, just for show

    setTimeout(() => { //delay output of result until after animation
        setTimeout(() => {
            console.log(`The ball landed on ${result}. Color: ${resultColor}`);
            roll = document.getElementById('roll')
            roll.style.backgroundColor = resultColor; //Choose background of result based on rolled color
            roll.textContent = `${resultColor} ${result}`; // update roll #
            let playerWins = false;
            switch (betType) { //Checks if player won based on input betType
                case 'red':
                    playerWins = (resultColor === 'red');
                    break;
                case 'black':
                    playerWins = (resultColor === 'black');
                    break;
                case 'even':
                    playerWins = isEven(result);
                    break;
                case 'odd':
                    playerWins = !isEven(result);
                    break;
                case 'green':
                    playerWins = (result === 0);
                    break;
            }

            if (playerWins) { //When player bet correct
                let winnings = (betType === 'green') ? betAmount * 36 : betAmount * 2; // Green pays 36:1, others pay 2:1
                console.log(`Congratulations! You win ${winnings} credits.`);
                balance += winnings; // Add winnings to balance
                document.getElementById('result').textContent = `Congratulations! You win ${winnings} credits.`;
            } else { //When player bet incorrect
                console.log("Sorry, you lose.");
                document.getElementById('result').textContent = `Sorry, you lose`;
            }
            document.getElementById('balance').textContent = `Balance: ${balance} credits`;
            document.getElementById('button').disabled = false;
        }, 500);
        wheelImg.style.transition = `none`;
        wheelImg.style.transform = `rotate(0deg)`; //reset wheel rotation to allow for rotation on next bet
    }, spinDuration);
});