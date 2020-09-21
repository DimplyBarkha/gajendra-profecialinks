
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    domain: 'ebay.ca',
    url: 'https://www.ebay.ca/sch/i.html?_nkw={searchTerms}&_sacat=0&_ipg=200&LH_PrefLoc=1',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
