
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    domain: 'harveynorman.com.au',
    url: 'https://www.harveynorman.com.au/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.product-item',
    noResultsXPath: null,
    zipcode: '',
  },
};
