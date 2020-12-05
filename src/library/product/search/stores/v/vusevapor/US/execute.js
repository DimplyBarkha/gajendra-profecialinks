
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vusevapor',
    domain: 'vusevapor.com',
    url: 'https://www.vusevapor.com',
    loadedSelector: 'span.product-image-wrapper',
    noResultsXPath: '//div[@class="missing-page"] | //h2[contains(text(),"Sorry, that page has gone")]',
    zipcode: '',
  },
};
