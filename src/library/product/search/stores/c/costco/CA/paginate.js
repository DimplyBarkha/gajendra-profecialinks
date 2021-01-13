
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    nextLinkSelector: 'li.forward a i.co-arrow-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-list',
    noResultsXPath: '//h1[contains(text(),"Try another search")]',
    openSearchDefinition: {
      template: 'https://www.costco.ca/CatalogSearch?currentPage={page}&dept=All&keyword={searchTerms}',
    },
    domain: 'costco.ca',
    zipcode: '',
  },
};
