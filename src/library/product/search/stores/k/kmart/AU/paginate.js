
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    nextLinkSelector: 'li a[id="WC_SearchBasedNavigationResults_pagination_link_right_categoryResults_bottom"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kmart.com.au',
    zipcode: '',
  },
};