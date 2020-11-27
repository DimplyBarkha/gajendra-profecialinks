
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    domain: 'matas.dk',
    url: 'https://www.matas.dk/soeg?search-query={searchTerms}',
    loadedSelector: 'div.js-productListContent',
    noResultsXPath: null,
    zipcode: '',
  },
};
