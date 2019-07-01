// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
console.log('inside popup.js');

const countryObj = {
  KRW: {
    id: 'changeCurrency1',
    text: 'Korean Won'
  },
  CAD: {
    id: 'changeCurrency2',
    text: 'Canadian Dollar'
  },
  EUR: {
    id: 'changeCurrency3',
    text: 'EU Euro'
  },
  CNY: {
    id: 'changeCurrency4',
    text: 'Chinese Yuan'
  },
  USD: {
    id: 'changeCurrency5',
    text: 'Return to default'
  }
};

for (let country in countryObj) {
  let element = document.getElementById(countryObj[country].id);
  element.innerHTML = countryObj[country].text;
  element.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { country }, function(response) {
        console.log(response.farewell);
      });
    });
  };
}
