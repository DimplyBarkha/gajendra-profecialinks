
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'trademe',
    domain: 'trademe.co.nz',
    url: 'https://www.trademe.co.nz/a/search?auto_category_jump=false&search_string={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
};
