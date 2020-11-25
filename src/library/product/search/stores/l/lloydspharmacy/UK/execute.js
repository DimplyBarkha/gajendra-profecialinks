
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lloydspharmacy',
    domain: 'lloydspharmacy.com',
    url: 'https://lloydspharmacy.com/search?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
