
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'macys',
    domain: 'macys.com',
    url: 'https://www.macys.com/shop/featured/searchTerms?cm_kws_ls={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
