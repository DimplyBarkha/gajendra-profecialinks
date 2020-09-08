
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    domain: 'verkkokauppa.com',
    url: 'https://www.verkkokauppa.com/fi/search?query={searchTerms}',
    loadedSelector: 'div.sc-1pejwl4-0',
    noResultsXPath: null,
    zipcode: '',
  },
};
