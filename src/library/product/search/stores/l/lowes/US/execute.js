module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}',
    loadedSelector: 'div.pl,#main-section',
    noResultsXPath: '//h1[contains(@data-selector,"splp-noresult-page-heading")]',
  },
};
