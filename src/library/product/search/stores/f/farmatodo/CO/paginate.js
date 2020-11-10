
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'farmatodo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class^=cont-card-ftd]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'farmatodo.com.co',
    zipcode: '',
  },
};
