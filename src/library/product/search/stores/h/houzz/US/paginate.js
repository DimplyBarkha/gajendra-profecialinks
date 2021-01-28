module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector: '.hz-pagination-next-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "body",
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: "houzz.com",
    zipcode: "",
  },
};
