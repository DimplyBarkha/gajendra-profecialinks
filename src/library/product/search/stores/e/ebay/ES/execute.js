
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    domain: 'ebay.es',
    url: 'https://www.ebay.es/sch/i.html?_nkw={searchTerms}&_sacat=0&_ipg=200&LH_PrefLoc=1',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
