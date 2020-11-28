
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    domain: 'backmarket.fr',
    url: 'https://www.backmarket.fr/search?q={searchTerms}',
    loadedSelector: 'div[id="main_container"]',
    noResultsXPath: '//div[@data-test="search-landing-no-result"]',
    zipcode: "''",
  },
};
