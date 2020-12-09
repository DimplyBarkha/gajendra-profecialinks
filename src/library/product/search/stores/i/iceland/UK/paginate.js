
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'iceland',
    nextLinkSelector: 'nav > ul > li:nth-child(3) > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'iceland.co.uk',
    zipcode: '',
  },
};
