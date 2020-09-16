
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'bloomingdales',
    nextLinkSelector: 'span.icon-next',
    spinnerSelector: 'div.spinner__logo',
    loadedSelector: 'div.b-product-tile__description',
    domain: 'bloomingdales.ae',
    zipcode: '',
  },
};
