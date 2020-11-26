
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'Prodirectsoccer',
    domain: 'prodirectsoccer.com',
    url: 'https://www.prodirectsoccer.com/search/?qq={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
