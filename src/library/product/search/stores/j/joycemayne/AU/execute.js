
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'joycemayne',
    domain: 'joycemayne.com.au',
    url: 'https://www.joycemayne.com.au/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div[id="category-grid"]',
    noResultsXPath: '//div[contains(@class, "no-result-box")]',
    zipcode: '',
  },
};
