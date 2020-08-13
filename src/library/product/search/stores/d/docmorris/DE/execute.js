
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    domain: 'docmorris.de',
    url: 'https://www.docmorris.de/search?query={searchTerms}',
    loadedSelector: 'div.productlist__item',
    noResultsXPath: '//div[@class="mod-standard-inner"]//div[@class="content"]//p',
    zipcode: '',
  },
};
