
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    loadedSelector: 'div.product_tile-prices',
    nextLinkSelector: 'li#pagination-next>a',
    domain: 'elcorteingles.es',
  },
};
