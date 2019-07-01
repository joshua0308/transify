'use strict';

let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
const currency = [' Won', 'Canadian Dollar', 'Dominican Pesos', 'Yuan'];
function constructOptions(kButtonColors) {
  for (let i = 0; i < currency.length; i++) {
    // button
    let button = document.createElement('button');
    button.style.backgroundColor = kButtonColors[i];

    // inner text
    button.innerText = currency[i];

    button.addEventListener('click', function() {
      chrome.storage.sync.set({ currency: currency[i] }, function() {
        console.log('currency is ' + currency[i]);
      });
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);
