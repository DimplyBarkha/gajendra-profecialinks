
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    domain: 'tractorsupply.com',
    url: 'https://www.tractorsupply.com/tsc/search/{searchTerms}',
    loadedSelector: 'div#grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
