module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    domain: 'amazon.com',
    loadedSelector: 'div[id="dp-container"]',
    // noResultsXPath: ,
    zipcode: '',
  },
};
