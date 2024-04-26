const result = document.querySelector('.result'); 
const coinIcon = document.getElementById('coin'); 
const button =  document.getElementById('btn'); 
coinIcon.insertAdjacentElement('afterend', result); // places result right after coin image and before flip button

document.getElementById("btn").addEventListener("click", function() {
  let side; // the side the coin lands on
  let imageUrl; // picture of the side
  const randomVal = Math.random(); // random val between [0,1]
  if (randomVal < 0.5) {
    side = 'Heads';
  } else {
    side = 'Tails';
  }
  imageUrl = side === 'Heads' ? 
  'https://media.geeksforgeeks.org/wp-content/uploads/20231016151817/heads.png' : 
  'https://media.geeksforgeeks.org/wp-content/uploads/20231016151806/tails.png'; 
  
  coinIcon.classList.add('flip'); 
  setTimeout(() => { 
    coinIcon.innerHTML = `<img src="${imageUrl}" alt="${side}">`; // changes the coin's image in html file
    coinIcon.classList.remove('flip');  
    setTimeout(() => { 
      result.textContent = `You flipped: ${side}`; 
      result.style.opacity = 1; 
      button.disabled = false; 
    }, 200); 
  }, 1000); 
});

