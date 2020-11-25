
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco',
    nextLinkSelector: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.product-list',
    noResultsXPath: '//h1[contains(text(),"Try another search")]',
    openSearchDefinition: {
      template: 'https://www.costco.com/CatalogSearch?currentPage={page}&dept=All&keyword={searchTerms}'
    },
    domain: 'costco.com',
    zipcode: '',
  },
};
