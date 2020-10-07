module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    loadedSelector: '.products_list-item:nth-last-child(1)',
    nextLinkSelector: 'li#pagination-next>a',
    domain: 'elcorteingles.es',
  },
};