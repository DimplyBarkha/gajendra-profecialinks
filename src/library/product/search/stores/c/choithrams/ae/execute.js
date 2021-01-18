
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    domain: 'choithrams.com',
    url: 'https://www.choithrams.com/search/?q={searchTerms}',
    loadedSelector: 'section[class="products-list"]',
    noResultsXPath: '//section[@class="products-list"]//div[contains(.,"No products")]',
    zipcode: '',
  },
};
