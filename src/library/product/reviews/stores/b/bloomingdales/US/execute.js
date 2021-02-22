
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    domain: 'bloomingdales.com',
    loadedSelector: 'div#mainContent',
    noResultsXPath: '//div[@class="zeroResultsSearchMessage"]|//p[@data-auto="error-text"]|//div[@class="unavailable-product"]',
    reviewUrl: 'https://www.bloomingdales.com/shop/product/?ID={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
