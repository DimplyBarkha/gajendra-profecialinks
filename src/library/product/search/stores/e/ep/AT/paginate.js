
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    nextLinkSelector: 'li.pagination-item-next > a.pagination-item-link',
    loadedSelector: 'div.cmsproductlist-desktop-list-layout-items',
    noResultsXPath: 'div.search-no-hits-wrapper',
    domain: 'ep.at',
    zipcode: '',
  },
};
