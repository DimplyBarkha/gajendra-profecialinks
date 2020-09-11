
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    domain: 'ebay.fr',
    url: 'https://www.ebay.fr/sch/i.html?_nkw={searchTerms}&_sacat=0',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
