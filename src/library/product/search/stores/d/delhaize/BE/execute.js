
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    domain: 'delhaize.be',
    url: 'https://www.delhaize.be/fr-be/shop/search?q={searchTerms}',
    loadedSelector: 'div.ProductSearchResultsPage',
    noResultsXPath: null,
    zipcode: '',
  },
};
