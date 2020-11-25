
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    loadedSelector: 'div.MarketplaceSellers div.product-seller-card',
    noResultsXPath: null,
    offerUrl: 'https://www.walmart.com/product/{id}/sellers',
    zipcode: '',
  },
};
