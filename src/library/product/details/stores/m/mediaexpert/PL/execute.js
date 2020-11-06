
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    domain: 'mediaexpert.pl',
    loadedSelector: 'div.is-productName h1',
    noResultsXPath: '//div[contains(@class,"is-noResults")]',
    zipcode: '',
  },
};
