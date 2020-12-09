
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'officedepot',
    nextLinkSelector: "div[class='button-group'] button[class='js-search-load-more btn btn-search btn-primary']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'officedepot.se',
    zipcode: '',
  },
};
