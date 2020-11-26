
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    nextLinkSelector: 'li.coveo-active+li>a',
    loadedSelector: 'div.coveo-result-list-container',
    noResultsXPath: '//div[@class="coveo-query-summary-no-results-string"]',
    spinnerSelector: 'div.coveo-fade-out',
    openSearchDefinition: {
      template: 'https://petsuppliesplus.com/Search#q={searchTerms}&first={index}&sort=relevancy',
      pageIndexMultiplier: 24,
      pageOffset: 1,
      pageStartNb: 0
    },
    domain: 'petsuppliesplus.com',
  },
}