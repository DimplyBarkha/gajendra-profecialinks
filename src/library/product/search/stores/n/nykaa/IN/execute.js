
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    domain: 'nykaa.com',
    url: 'https://www.nykaa.com/search/result/?q={searchTerms}',
    loadedSelector: 'div.row.clearfix.plp-desktop',
    noResultsXPath: 'a.search-again',
    zipcode: '',
  },
};
