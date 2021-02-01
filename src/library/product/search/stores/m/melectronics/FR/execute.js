module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'melectronics',
    domain: 'melectronics.ch',
    url: 'https://www.melectronics.ch/fr/s?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="cms-no-result-label"]',
    zipcode: "''",
  },
};
