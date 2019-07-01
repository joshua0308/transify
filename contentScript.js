const exchangeRatesURL = 'https://api.exchangeratesapi.io/latest?base=USD';
const userLanguage = window.navigator.language;
const priceArr = [];
const idArr = [];

console.log(userLanguage);

const countryObj = {
  KRW: {
    symbol: '₩ ',
    decimal: 0,
    defaultRate: 1155.67,
    price: []
  },
  CAD: {
    symbol: 'C$ ',
    decimal: 2,
    defaultRate: 1.31,
    price: []
  },
  EUR: {
    symbol: '€ ',
    decimal: 2,
    defaultRate: 0.88,
    price: []
  },
  CNY: {
    symbol: '¥ ',
    decimal: 2,
    defaultRate: 6.87,
    price: []
  },
  USD: {
    price: []
  }
};

mapLocalPriceArrays();
findAllPriceElements();
addCurrencyListeners();

async function mapLocalPriceArrays() {
  let data = {};

  try {
    const response = await fetch(exchangeRatesURL);
    const responseJSON = await response.json();
    data = responseJSON.rates;

    // use exchange rates in local storage if the API call was made less than one hour
    chrome.storage.local.set(data, () => {
      console.log('Data stored in chrome local storage');
    });
  } catch {
    data = null;
    console.log('Inside catch block');
  }
  // chrome.storage.local.get(['KRW', 'CAD'], result => console.log(result));

  for (let country in countryObj) {
    if (country !== 'USD') {
      let symbol = countryObj[country].symbol;
      let decimal = countryObj[country].decimal;
      let exchangeRate = data
        ? data[country]
        : countryObj[country]['defaultRate'];

      countryObj[country].price = mapToLocalPrice(
        priceArr,
        exchangeRate,
        symbol,
        decimal
      );
    }
  }

  // map local price to array
  function mapToLocalPrice(fromArr, exchangeRate, currencySymbol, decimal) {
    return fromArr.map(dollarPrice => {
      const convertedPrice = convertToLocal(dollarPrice, exchangeRate, decimal);
      if (!Number.isNaN(parseFloat(convertedPrice))) {
        return currencySymbol + addComma(convertedPrice);
      }
      return 'cannot convert';
    });
  }

  // convert dollar price to local price
  function convertToLocal(price, exchangeRate, decimal = 0) {
    price = price * exchangeRate;
    return parseFloat(price).toFixed(decimal);
  }

  // add comma to the converted price
  function addComma(price) {
    price = price.toString();
    let commaPrice = '';
    let commaCounter = 0;
    let start = price.includes('.') ? price.indexOf('.') - 1 : price.length - 1;

    for (let i = start; i >= 0; i -= 1) {
      commaPrice = price[i] + commaPrice;
      commaCounter += 1;
      if (commaCounter % 3 === 0 && i !== 0) {
        commaPrice = ',' + commaPrice;
      }
    }

    commaPrice += price.slice(start + 1);
    return commaPrice;
  }
}

function findAllPriceElements() {
  // SELECT ALL SPAN ELEMENTS
  const spanArr = document.body.querySelectorAll('span');

  // iterate through span elements
  for (let i = 0; i < spanArr.length; i += 1) {
    if (
      spanArr[i].classList.value !== '' &&
      spanArr[i].innerText.includes('$')
    ) {
      // set unique id to the elements that contain dollar sign
      spanArr[i].setAttribute('id', `transifyId${i}`);

      // push the newly assigned id name to the id array
      idArr.push(spanArr[i].id);

      // push the dollar price to countryObj.USD.price
      countryObj.USD.price.push(spanArr[i].innerText);

      // push the number value of the price to priceArr
      priceArr.push(priceToNum(spanArr[i].innerText));
    }
  }

  // convert price string to float number
  function priceToNum(price) {
    price = parseFloat(
      price
        .trim()
        .replace('$', '')
        .replace(/\,/g, '')
    );
    return price;
  }
}

// add listeners for each currency
function addCurrencyListeners() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let country = request.country;

    idArr.forEach((el, index) => {
      let element = document.body.querySelector(`#${el}`);
      if (element) {
        let countryPrice = countryObj[country]['price'][index];
        if (countryPrice !== 'cannot convert') {
          element.innerText = countryPrice;
          element.style.backgroundColor =
            country !== 'USD' ? 'yellow' : 'transparent';
        }
      }
    });

    sendResponse({ farewell: 'Currency: ' + country });
  });
}
