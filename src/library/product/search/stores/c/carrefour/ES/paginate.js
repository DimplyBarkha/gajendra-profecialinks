
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'carrefour',
    nextLinkSelector: 'div[id="pagination-box-arrow-right"]>a[class="next "]',
    domain: 'carrefour.es',
  },
};
