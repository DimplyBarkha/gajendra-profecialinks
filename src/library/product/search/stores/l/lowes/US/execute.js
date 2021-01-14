
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}',
    loadedSelector: 'section#main',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")] | //div[@id="mainContent"] | //div[contains(@class ,"grid-container")]',
  },
};
