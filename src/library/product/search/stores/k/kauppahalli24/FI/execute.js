module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'kauppahalli24',
    domain: 'kauppahalli24.fi',
    url: 'https://www.kauppahalli24.fi/',
    loadedSelector: 'nav[class*="navigation"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
