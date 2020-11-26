
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    domain: 'petsmart.ca',
    url: 'https://www.petsmart.ca/search/?q={searchTerms}',
    loadedSelector: 'ul#search-result-items li',
    noResultsXPath: '//p[contains(text(), "no results")]',
    zipcode: '',
  },
};
