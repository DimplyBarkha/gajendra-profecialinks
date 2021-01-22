
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    nextLinkSelector: 'button#WC_SearchBasedNavigationResults_pagination_link_right_categoryResults',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'coppel.com',
    zipcode: '',
  },
};
