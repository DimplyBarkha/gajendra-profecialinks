
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    domain: 'ebay.de',
    url: 'https://www.ebay.de/sch/i.html?_nkw={searchTerms}&_sacat=0',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
