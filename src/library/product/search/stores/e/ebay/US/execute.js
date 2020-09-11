
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    domain: 'ebay.com',
    url: 'https://www.ebay.com/sch/i.html?_nkw={searchTerms}&_sacat=0&_ipg=200',
    loadedSelector: 'ul.srp-results > li[data-view]',
    noResultsXPath: '//h3[contains(@class,"srp-save-null-search__heading")]',
    zipcode: '',
  },
};
