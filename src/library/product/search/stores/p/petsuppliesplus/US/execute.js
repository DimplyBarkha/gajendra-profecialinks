
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    domain: 'petsuppliesplus.com',
    url: 'https://petsuppliesplus.com/Search#q={searchTerms}&sort=relevancy',
    noResultsXPath: '//div[@class="coveo-query-summary-no-results-string"]',
    zipcode: '',
  },
};
