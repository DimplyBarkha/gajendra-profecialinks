
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PK',
    store: 'metro-online',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: "div[class='loadmorebtn']",
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'metro-online.pk',
    zipcode: '',
  },
};
