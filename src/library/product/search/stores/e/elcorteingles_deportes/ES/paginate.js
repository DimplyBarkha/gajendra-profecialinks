
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    nextLinkSelector: '#pagination-next > a',
    loadedSelector: '.products_list-item:nth-last-child(1)',
    zipcode: '',
    domain: 'elcorteingles.es',
  },
};
