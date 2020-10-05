
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'lastprice',
    domain: 'lastprice.co.il',
    url: 'https://www.lastprice.co.il/category.asp?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
