
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    domain: 'ebay.com.au',
    url: 'https://www.ebay.com.au/sch/i.html?_nkw={searchTerms}&_sacat=0',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
