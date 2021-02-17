module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    nextLinkSelector: 'div.pagination > a',
    spinnerSelector: 'div.rd__product-list div.rd__logo-spinner',
    domain: 'douglas.de',
  },
};
