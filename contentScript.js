////////////////////////////////////////
//// DETECH USER'S BROWSER LANGUAGE ////
////////////////////////////////////////
console.log(window.navigator.language);

///////////////////////////////////////////////
//// USE FETCH TO GET DAILY EXCHANGE RATES ////
///////////////////////////////////////////////

fetch('https://api.exchangeratesapi.io/latest?base=USD')
  .then(incoming => incoming.json())
  .then(data => {
    let priceAPIArr = [
      data.rates.KRW,
      data.rates.CAD,
      data.rates.EUR,
      data.rates.CNY
    ];
    return priceAPIArr;
  })
  .then(array => console.log(array));

// SELECT ALL SPAN ELEMENTS
let obj = document.body.querySelectorAll('span');

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

// CREATE A FUNCTION THAT WILL TAKE CURRENCY AS AN ARGUMENT

let priceWon = priceArr.map(function(el) {
  let convertedPrice = toWon(el);
  if (!Number.isNaN(parseFloat(convertedPrice))) {
    return '₩ ' + addComma(toWon(el).toString());
  }
  return 'cannot convert';
});

let priceCanadian = priceArr.map(function(el) {
  if (!Number.isNaN(parseFloat(toCanadian(el)))) {
    return 'C$ ' + addComma(toCanadian(el).toString());
  }
  return 'cannot convert';
});

let priceEuro = priceArr.map(function(el) {
  if (!Number.isNaN(parseFloat(toEuro(el)))) {
    return '€ ' + addComma(toEuro(el).toString());
  }
  return 'cannot convert';
});

let priceYuan = priceArr.map(function(el) {
  if (!Number.isNaN(parseFloat(toYuan(el)))) {
    return '¥ ' + addComma(toYuan(el).toString());
  }
  return 'cannot convert';
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  idArr.forEach((el, index) => {
    let element = document.body.querySelector(`#${el}`);
    let currency = request.currency;
    if (element) {
      if (priceWon[index] !== 'cannot convert') {
        if (currency === 'KRW') element.innerText = priceWon[index];
        else if (currency === 'CAD') element.innerText = priceCanadian[index];
        else if (currency === 'EUR') element.innerText = priceEuro[index];
        else if (currency === 'CNY') element.innerText = priceYuan[index];
        else if (currency === 'USD') {
          element.innerText = originalPriceArr[index];
          element.style.backgroundColor = 'transparent';
        }
        if (currency !== 'USD') {
          element.style.backgroundColor = 'yellow';
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
  let conversion = 1 / 0.00084;
  price = price * conversion;
  return parseFloat(price).toFixed();
}

function toCanadian(price) {
  let conversion = 1.33;
  price = price * conversion;
  return parseFloat(price).toFixed(2);
}

function toEuro(price) {
  let conversion = 0.8844078889;
  price = price * conversion;
  return parseFloat(price).toFixed(2);
}

function toYuan(price) {
  let conversion = 1 / 0.14;
  price = price * conversion;
  return parseFloat(price).toFixed(2);
}

// https://www.amazon.com/Gillette-Mach3-Razor-Blades-Refills/dp/B0039LMTBA?ref_=Oct_DLandingS_PC_7e8aa158_3&smid=ATVPDKIKX0DER&th=1

//-------------------------------------------------
//-------------CURRCONV API------------------------
//-------------------------------------------------

// const apiKey = 'f7f89cbbe808a7d77f98';

// let urlKRW =
//   'https://free.currconv.com/api/v7/convert?q=USD_KRW&compact=ultra&apiKey=f7f89cbbe808a7d77f98';
// let urlDOP =
//   'https://free.currconv.com/api/v7/convert?q=USD_DOP&compact=ultra&apiKey=f7f89cbbe808a7d77f98';
// let urlCNY =
//   'https://free.currconv.com/api/v7/convert?q=USD_CNY&compact=ultra&apiKey=f7f89cbbe808a7d77f98';
// let urlCAD =
//   'https://free.currconv.com/api/v7/convert?q=USD_CAD&compact=ultra&apiKey=f7f89cbbe808a7d77f98';

// let urlArr = [urlKRW, urlDOP, urlCNY, urlCAD];
// let currencyTracker = {};

// for (let i = 0; i < urlArr.length; i += 1) {
//   fetch(urlArr[i])
//     .then(response => response.json())
//     .then(myJson => {
//       currencyTracker[
//         urlArr[i].slice(
//           urlArr[i].indexOf('USD') + 4,
//           urlArr[i].indexOf('USD') + 7
//         )
//       ] = Object.values(myJson)[0];
//     })
//     .catch(err => {
//       console.error(err);
//     });
// }

// console.log(currencyTracker);

//-------------------------------------------------
//-------------CURRCONV API------------------------
//-------------------------------------------------
