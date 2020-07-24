module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    nextLinkSelector: 'section.rd__product-overview__pagination > div > a.rd__pagination__next',
    spinnerSelector: 'div.rd__product-list div.rd__logo-spinner',
    domain: 'douglas.de',
  },
};
