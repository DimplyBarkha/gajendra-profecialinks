
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    nextLinkSelector: 'li#pagination-next>a',
    loadedSelector: 'ul.c12.products_list._four',
    domain: 'elcorteingles.es',
  },
};
