
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    nextLinkSelector: 'li.coveo-active+li>a',
    loadedSelector: 'div.coveo-result-list-container',
    noResultsXPath: '//div[@class="coveo-query-summary-no-results-string"]',
    spinnerSelector: 'div.coveo-fade-out',
    domain: 'petsuppliesplus.com',
  },
}