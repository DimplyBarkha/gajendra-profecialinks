
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    domain: 'harveynorman.com.au',
    url: 'https://www.harveynorman.com.au/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div#content',
    noResultsXPath: '//p[contains(text(),"There are no products matching the selection.")]',
    zipcode: "''",
  },
};
