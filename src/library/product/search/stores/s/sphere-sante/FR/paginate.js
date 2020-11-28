
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    nextLinkSelector: 'div.pagination a:last-child',
    loadedSelector: 'div.page',
    domain: 'sphere-sante.com',
    zipcode: '',
  },
};
