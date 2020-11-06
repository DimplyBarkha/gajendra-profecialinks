
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    domain: 'windeln.de',
    url: 'https://www.windeln.de/search/?q={searchTerms}',
    loadedSelector: 'div.cm-element-products-box',
    noResultsXPath: '//div[@class="cm-content search-no-result-box"]',
    zipcode: '',
  },
};
