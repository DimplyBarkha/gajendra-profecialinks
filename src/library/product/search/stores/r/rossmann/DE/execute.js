
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    domain: 'rossmann.de',
    url: 'https://www.rossmann.de/de/search?q={searchTerms}%3Arelevance&pageSize=60#',
    loadedXpath: '//div[contains(@class,"rm-animate--fadeIn")]',
    noResultsXPath: '//div[contains(@class,"empty-search")]',
    zipcode: '',
  },
};
