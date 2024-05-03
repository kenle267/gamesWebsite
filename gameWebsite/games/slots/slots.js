const slots = document.querySelectorAll('.slot');
const spinButton = document.getElementById('spinButton');
const balanceDisplay = document.getElementById('balance');
const betAmount = document.getElementById('betAmount');

let balance = 100;

// defines each icon type and their respective probablities
const icons = [
    { icon: 'cherry', probability: 0.5 },
    { icon: 'banana', probability: 0.4 },
    { icon: 'seven', probability: 0.1 }
];

// Function to get a random icon based on probabilities
function getRandomIcon() {
  const randomNum = Math.floor(Math.random() * 10) + 1; // Generate random number between 1 and 10

  if (randomNum <= 5) {
    return 'cherry'; // 50% probability for cherry (numbers 1 to 5)
  } else if (randomNum <= 9) {
    return 'banana'; // 40% probability for banana (numbers 6 to 9)
  } else {
    return 'seven'; // 10% probability for seven (number 10)
  }
}

// Function to update slot icons
function updateSlots() {
  slots.forEach((slot, index) => {
    slot.className = 'slot';
    const icon = getRandomIcon();
    slot.classList.add(icon);

    // Update image inside the slot
    const imgElement = document.getElementById(`slot${index + 1}`);
    imgElement.src = `${icon}.jpg`; // Set image source based on the rolled icon
  });
}

function checkInput(){
  const betValue = parseInt(betAmount.value);
  if (isNaN(betValue) || betValue <= 0 || Number.isInteger(betValue) == false) {
    alert('Please enter a valid bet amount.');
    return false;
  }

  if (betValue > balance) {
    alert('Insufficient Balance');
    return false;
  }

  return true;
}

// Main function to do the logic of the roll
spinButton.addEventListener('click', function() {
  if (!checkInput()) {
    return; // If input validation fails, exit early
  }
  balance -= parseInt(betAmount.value);
  balanceDisplay.textContent = `${balance} credits`;
  document.getElementById('spinButton').disabled = true;
  // Add spinning animation class, to begin the spin
  slots.forEach(slot => {
    slot.classList.add('spin');
  });
  setTimeout(() => {
    // Stop spinning animation after a delay
    slots.forEach(slot => {
        slot.classList.remove('spin');
    });

    // Update slot icons
    updateSlots();

    setTimeout(() => {
      // Check for win condition
      const firstIcon = slots[0].classList[1];
      let isWin = true;
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (!slot.classList.contains(firstIcon)) {
          isWin = false;
          break;
        }
      }
      // Update balance based on win or loss
      if (isWin) {
        document.getElementById('result').textContent = `Congratulations! You win!`;
        switch (firstIcon) {
          case 'cherry':
            balance += parseInt(betAmount.value) * 8;
            break;
          case 'banana':
            balance += parseInt(betAmount.value) * 15;
            break;
          case 'seven':
            balance += parseInt(betAmount.value) * 1000;
            break;
          default:
            break;
          }
      }else{
        document.getElementById('result').textContent = `Sorry! You Lost!`;
      }
      // Update balance on html
      balanceDisplay.textContent = `${balance} credits`;
      document.getElementById('result')
      document.getElementById('spinButton').disabled = false;
    }, 1000); // Delay after stopping spinning
  }, 2000); // Duration of spinning animation
});