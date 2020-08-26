
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'domayne',
    domain: 'domayne.com.au',
    url: 'https://www.domayne.com.au/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div[id="category-grid"]',
    noResultsXPath: '//div[contains(@class, "no-result-box")]',
    zipcode: '',
  },
};
