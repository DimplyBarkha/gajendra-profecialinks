
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'qvc',
    domain: 'qvc.it',
    loadedSelector: 'div[class*="product-gallery"] img',
    noResultsXPath: '/html[not(body[contains(@class,"product-detail-page")])] | //body[contains(@class,"login-page")] | //div[@class="title-header"]//h3[contains(text(),"Login")]',
    zipcode: '',
  },
};
