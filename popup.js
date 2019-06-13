// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
let changeCurrency1 = document.getElementById('changeCurrency1');
let changeCurrency2 = document.getElementById('changeCurrency2');
let changeCurrency3 = document.getElementById('changeCurrency3');
let changeCurrency4 = document.getElementById('changeCurrency4');
let changeCurrency5 = document.getElementById('changeCurrency5');

changeCurrency1.innerText = 'Korean Won';
changeCurrency2.innerText = 'Canadian Dollar';
changeCurrency3.innerText = 'Dominican Pesos';
changeCurrency4.innerText = 'Chinese Yuan';
changeCurrency5.innerText = 'Return to default';

changeCurrency1.onclick = function(element) {
  let currency = element.target.value;
  console.log(currency);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: 'korean' }, function(
      response
    ) {
      console.log(response.farewell);
    });
  });
};

changeCurrency2.onclick = function(element) {
  let currency = element.target.value;
  console.log(currency);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: 'canadian' }, function(
      response
    ) {
      console.log(response.farewell);
    });
  });
};

changeCurrency3.onclick = function(element) {
  let currency = element.target.value;
  console.log(currency);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: 'dominican' }, function(
      response
    ) {
      console.log(response.farewell);
    });
  });
};
changeCurrency4.onclick = function(element) {
  let currency = element.target.value;
  console.log(currency);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: 'chinese' }, function(
      response
    ) {
      console.log(response.farewell);
    });
  });
};

changeCurrency5.onclick = function(element) {
  let currency = element.target.value;
  console.log(currency);

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: 'dollar' }, function(
      response
    ) {
      console.log(response.farewell);
    });
  });
};
