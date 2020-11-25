
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'petco',
    domain: 'petco.com',
    loadedSelector: 'main h1[class*="ProductNamestyled"]',
    noResultsXPath: '//main[contains(@class,"NotFoundstyled__Main")]',
    zipcode: '',
  },
};
