
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    domain: 'iga.net',
    url: 'https://www.iga.net/fr/search?t=&k={searchTerms}',
    loadedSelector: 'div[class="main-content"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
