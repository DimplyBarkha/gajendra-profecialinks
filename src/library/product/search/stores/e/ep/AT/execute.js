
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    domain: 'ep.at',
    url: 'https://www.ep.at/search/?q={searchTerms}',
    loadedSelector: 'div.cmsproductlist-desktop-list-layout-items',
    noResultsXPath: 'div.search-no-hits-wrapper',
    zipcode: '',
  },
};
