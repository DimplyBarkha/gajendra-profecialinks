
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'courir',
    nextLinkSelector: 'button.display-more-products',
    loadedSelector: 'ul.search-result-items',
    noResultsXPath: 'div.page-product-search-noresult',
    domain: 'courir.com',
  },
};
