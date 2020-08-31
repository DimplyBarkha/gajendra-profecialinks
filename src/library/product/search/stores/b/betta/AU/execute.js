module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    domain: 'betta.com.au',
    url: "https://www.betta.com.au/catalogsearch/result/?q={searchTerms}",
    loadedSelector: 'div.item-list',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
