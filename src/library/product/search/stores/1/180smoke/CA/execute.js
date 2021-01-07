
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: '180smoke',
    domain: '180smoke.ca',
    url: 'https://www.180smoke.ca/search?q={searchTerms}',
    loadedSelector: 'div.product-list',
    noResultsXPath: '//div[contains(text(),"Sorry, no results for this search.")]',
    zipcode: '',
  },
};
