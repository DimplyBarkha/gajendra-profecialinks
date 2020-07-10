
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    nextLinkSelector: 'a[rel="next"]',
    loadedSelector: 'ul.product-list>li',
    zipcode: '',
    domain: 'elcorteingles.es',
  },
};
