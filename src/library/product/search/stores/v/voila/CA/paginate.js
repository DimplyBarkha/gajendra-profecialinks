
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'voila',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: `//span[contains(text(),"We couldn't find any products")]`,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'voila.ca',
    zipcode: '',
  },
};
