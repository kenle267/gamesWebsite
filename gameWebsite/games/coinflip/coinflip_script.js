const result = document.querySelector('.result'); 
const coinIcon = document.getElementById('coinIcon'); 
const button =  document.getElementById('btn');
const balance = document.getElementById('balance');
const buttonHeads = document.getElementById('headsButton');
const buttonTails = document.getElementById('tailsButton');
const betAmount = document.getElementById('betAmount');
coinIcon.insertAdjacentElement('afterend', result); // places result right after coin image and before flip button
let balanceTotal = 100;

let selectedChoice = null;

// function to make the button toggled
function toggleButtonSelection(selectedButton, unselectedButton) {
    selectedButton.classList.add('selected'); // Add selected class to the clicked button
    if (unselectedButton) {
        unselectedButton.classList.remove('selected'); // Remove selected class from the other button
    }
    selectedChoice = selectedButton.textContent.trim(); // Update selectedChoice based on button text
}

// listens for heads click
buttonHeads.addEventListener('click', function() {
    if (selectedChoice !== 'Heads') {
        toggleButtonSelection(buttonHeads, buttonTails); // Select "Heads" and unselect "Tails" if necessary
    }
});

// listens for tails click
buttonTails.addEventListener('click', function() {
    if (selectedChoice !== 'Tails') {
        toggleButtonSelection(buttonTails, buttonHeads); // Select "Tails" and unselect "Heads" if necessary
    }
});

// Makes sure input is valid
function checkInput(){
  if (!selectedChoice) {
    alert('Please select "Heads" or "Tails" before flipping.');
    return false;
  }

  const betValue = parseInt(betAmount.value);
  if (isNaN(betValue) || betValue <= 0) {
    alert('Please enter a valid bet amount.');
    return false;
  }

  if (betValue > balanceTotal) {
    alert('Insufficient Balance');
    return false;
  }

  return true;
}

//listens for FLip button click
document.getElementById("btn").addEventListener("click", function() {
  if (!checkInput()) {
    return; // If input validation fails, exit early
  }
  let side; // the side the coin lands on
  let image; // picture of the side
  const randomVal = Math.random(); // random val between [0,1]
  if (randomVal < 0.5) {
    side = 'Heads';
  } else {
    side = 'Tails';
  }
  image = side === 'Heads' ? 
  "heads.png" : 
  "tails.png"; 
  
  coinIcon.classList.add('flip'); //Starts flip animation
  button.disabled = true; // Disable clicking while flipping
  setTimeout(updateImage = () => { // arrow function to update html with coin image and add and remove .flip class
    coinIcon.src = image;
    coinIcon.classList.remove('flip');  
    setTimeout(updateResult = () => { // arrow function to update .result class with side coin landed on
      result.textContent = `You flipped: ${side}`; 
      result.style.opacity = 1;
      result.style.fontWeight = "bold";
      result.style.color = "Black";
      result.style.textAlign = "center";
      if (side === selectedChoice) {
          // Win scenario: Increase balance
          balanceTotal += parseInt(betAmount.value);
      } else {
          // Lose scenario: Decrease balance
          balanceTotal -= parseInt((betAmount.value));
      }
      button.disabled = false; 
      document.getElementById('balance').textContent = `${balanceTotal}`;
    }, 200); 
  }, 1000); 
});

