const result = document.querySelector('.result'); 
const coinIcon = document.getElementById('coinIcon'); 
const button =  document.getElementById('btn');
const balance = document.getElementById('balance');
coinIcon.insertAdjacentElement('afterend', result); // places result right after coin image and before flip button
let balanceTotal = 100;

document.getElementById("btn").addEventListener("click", function() {
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
  
  coinIcon.classList.add('flip'); 
  setTimeout(updateImage = () => { // arrow function to update html with coin image and add and remove .flip class
    coinIcon.src = image;
    coinIcon.classList.remove('flip');  
    setTimeout(updateResult = () => { // arrow function to update .result class with side coin landed on
      result.textContent = `You flipped: ${side}`; 
      result.style.opacity = 1; 
      button.disabled = false; 
    }, 200); 
  }, 1000); 
});

