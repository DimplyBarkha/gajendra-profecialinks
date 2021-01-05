module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'mymarket',
    domain: 'mymarket.gr',
    url: 'https://eshop.mymarket.gr/products?search={searchTerms}',
    loadedSelector: 'div.views-row--product-teaser.views-row',
    noResultsXPath: '//div[@class="findastic-no-results"]',
    zipcode: '',
  },
};
