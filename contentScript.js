// https://www.amazon.com/Gillette-Mach3-Razor-Blades-Refills/dp/B0039LMTBA?ref_=Oct_DLandingS_PC_7e8aa158_3&smid=ATVPDKIKX0DER&th=1

console.log(window.navigator.language);

const apiKey = 'f7f89cbbe808a7d77f98';

let urlKRW =
  'https://free.currconv.com/api/v7/convert?q=USD_KRW&compact=ultra&apiKey=f7f89cbbe808a7d77f98';
let urlDOP =
  'https://free.currconv.com/api/v7/convert?q=USD_DOP&compact=ultra&apiKey=f7f89cbbe808a7d77f98';
let urlCNY =
  'https://free.currconv.com/api/v7/convert?q=USD_CNY&compact=ultra&apiKey=f7f89cbbe808a7d77f98';
let urlCAD =
  'https://free.currconv.com/api/v7/convert?q=USD_CAD&compact=ultra&apiKey=f7f89cbbe808a7d77f98';

let urlArr = [urlKRW, urlDOP, urlCNY, urlCAD];
let currencyTracker = {};

for (let i = 0; i < urlArr.length; i += 1) {
  fetch(urlArr[i])
    .then(response => response.json())
    .then(myJson => {
      currencyTracker[
        urlArr[i].slice(urlArr[i].indexOf('USD'), urlArr[i].indexOf('USD') + 7)
      ] = Object.values(myJson)[0];
    });
}

let obj = document.body.querySelectorAll('span');

let classArr = [];
let idArr = [];

// push all prices to priceArr
let priceArr = [];
let originalPriceArr = [];

for (let i = 0; i < obj.length; i += 1) {
  if (obj[i].classList.value !== '' && obj[i].innerText.includes('$')) {
    // set unique id to the elements that contain dollar sign
    obj[i].setAttribute('id', `transifyId${i}`);

    // push the id name to the id array
    idArr.push(obj[i].id);

    originalPriceArr.push(obj[i].innerText);
    priceArr.push(priceToNum(obj[i].innerText));
  }
}

let priceWon = priceArr.map(function(el) {
  if (!Number.isNaN(toWon(el))) {
    return '₩ ' + addComma(toWon(el).toString());
  }
  return 'cannot convert';
});

let priceCanadian = priceArr.map(function(el) {
  if (!Number.isNaN(toCanadian(el))) {
    return 'C$ ' + addComma(toCanadian(el).toString());
  }
  return 'cannot convert';
});

let pricePesos = priceArr.map(function(el) {
  if (!Number.isNaN(toPesos(el))) {
    return 'RD$ ' + addComma(toPesos(el).toString());
  }
  return 'cannot convert';
});

let priceYuan = priceArr.map(function(el) {
  if (!Number.isNaN(toYuan(el))) {
    return '¥ ' + addComma(toYuan(el).toString());
  }
  return 'cannot convert';
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  idArr.forEach((el, index) => {
    if (document.body.querySelector(`#${el}`)) {
      if (priceWon[index] !== 'cannot convert') {
        if (request.greeting == 'korean') {
          document.body.querySelector(`#${el}`).innerText = priceWon[index];
        } else if (request.greeting == 'canadian') {
          document.body.querySelector(`#${el}`).innerText =
            priceCanadian[index];
        } else if (request.greeting == 'dominican') {
          document.body.querySelector(`#${el}`).innerText = pricePesos[index];
        } else if (request.greeting == 'chinese') {
          document.body.querySelector(`#${el}`).innerText = priceYuan[index];
        } else if (request.greeting == 'dollar') {
          document.body.querySelector(`#${el}`).innerText =
            originalPriceArr[index];
          document.body.querySelector(`#${el}`).style.backgroundColor =
            'transparent';
        }
        if (request.greeting !== 'dollar') {
          document.body.querySelector(`#${el}`).style.backgroundColor =
            'yellow';
        }
      }
    }
  });
});

function addComma(price) {
  let commaPrice = '';
  if (price.includes('.')) {
    let starting = price.indexOf('.');
    let commaCounter = 0;
    for (let i = starting - 1; i >= 0; i--) {
      commaPrice = price.charAt(i) + commaPrice;
      commaCounter++;
      if (commaCounter % 3 === 0 && i !== 0) {
        commaPrice = ',' + commaPrice;
      }
    }
    commaPrice += price.slice(starting);
  } else {
    let commaCounter = 0;
    for (let i = price.length - 1; i >= 0; i--) {
      commaPrice = price.charAt(i) + commaPrice;
      commaCounter++;
      if (commaCounter % 3 === 0 && i !== 0) {
        commaPrice = ',' + commaPrice;
      }
    }
  }
  return commaPrice;
}

function priceToNum(price) {
  price = parseFloat(
    price
      .trim()
      .replace('$', '')
      .replace(/\,/g, '')
  );
  return price;
}

function toWon(price) {
  price = (price * 1) / 0.00084;
  return parseInt(price);
}

function toCanadian(price) {
  price = price * 1.33;
  return parseFloat(price).toFixed(2);
}

function toPesos(price) {
  price = (price * 1) / 0.019;
  return parseInt(price);
}

function toYuan(price) {
  price = (price * 1) / 0.14;
  return parseFloat(price).toFixed(2);
}
