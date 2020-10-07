
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    loadedSelector: '.grid-item:nth-last-child(1)',
    nextLinkSelector: 'li#pagination-next>a',
    domain: 'elcorteingles.es',
  },
};
