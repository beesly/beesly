'use strict';

// mock out fetch()
// @todo this won't work with any kind of asynchronous testing...

var nextResponse = null;

window.fetch = () => {
  return new Promise((resolve, reject) => {
    resolve(nextResponse);

    nextResponse = null;
  });
};

window.fetch.respondWith = (val) => {
  nextResponse = val;
};

jest.autoMockOff();
