
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'carrefour',
    nextLinkSelector: 'div.pagination a.next',
    domain: 'carrefour.es',
  },
};
