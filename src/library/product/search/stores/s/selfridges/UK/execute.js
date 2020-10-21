
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    url: 'https://www.selfridges.com/GB/en/cat/?freeText={searchTerms}&srch=Y',
    loadedSelector: '.listing-items.c-listing-items.initialized',
    noResultsXPath: '.page-no-results.layout-default.template-error-template.grid-bootstrap.spinner-off.initial-spinner-off',
    zipcode: '',
  },
};
