
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    domain: 'ebay.co.uk',
    url: 'https://www.ebay.it/sch/i.html?_nkw={searchTerms}&_sacat=0',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
