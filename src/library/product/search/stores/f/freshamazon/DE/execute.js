
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    domain: 'freshamazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&page={page}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
