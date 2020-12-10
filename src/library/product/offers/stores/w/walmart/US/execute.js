
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: 'div[data-tl-id*="ProductSellerCard"]',
    noResultsXPath: '//div[@class="count-cell"][contains(.,"Additional Sellers (0)")]',
    offerUrl: 'https://www.walmart.com/product/{id}/sellers',
    zipcode: '',
  },
};
