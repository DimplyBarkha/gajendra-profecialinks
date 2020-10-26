
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    nextLinkSelector: "#pagnNextString, #pagnNextLink, ul.pagination li:nth-child(3) a[class*=pagination__link]:not([class*='pagination__link--current'])",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'pacson.se',
    zipcode: '',
  },
};
