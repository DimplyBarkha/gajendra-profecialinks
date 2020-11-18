
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PK',
    store: 'metro-online',
    nextLinkSelector: "div[class='no-pagination-selector']",
    mutationSelector: null,
    spinnerSelector: "div[class='loadmorebtn'] div[class='loadmoreloader']",
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'metro-online.pk',
    zipcode: '',
  },
};
