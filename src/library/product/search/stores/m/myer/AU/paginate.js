
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    nextLinkSelector: "div.css-1d2lwfn > #paginationContainer > li.next > a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div.body-content",
    noResultsXPath: "div.css-s9ry5n[data-automation='no-results']",
    openSearchDefinition: null,
    domain: 'myer.com.au',
    zipcode: '',
  },
};
