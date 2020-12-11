module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector:
      "#hz-br__result-set-root > div.hz-card.clearfix.hz-br__result-set > div.browse-result-set-footer-wrapper > div > div.hz-pagination-bottom-wrapper.hz-track-me > div > div > a.hz-pagination-link.hz-pagination-link--next",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: ".hz-image-container img",
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: "houzz.com",
    zipcode: "",
  },
};
