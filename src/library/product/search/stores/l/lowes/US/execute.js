module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}',
    loadedSelector: 'div.pl,#main-section',
    noResultsXPath: '//h1[@data-test="noresult-page-heading"]',
  },
};
