
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    domain: 'hazesmokeshop.ca',
    url: 'https://hazesmokeshop.ca/brand/{searchTerms}/',
    loadedSelector: 'div.shop-loop-head',
    noResultsXPath: '//h3[text()="Not Found"]',
    zipcode: '',
  },
};
