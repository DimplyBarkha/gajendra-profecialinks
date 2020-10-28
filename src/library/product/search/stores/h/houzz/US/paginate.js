module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector:
      "#hz-br__result-set-root > div.hz-card.clearfix.hz-br__result-set > div:nth-child(3) > div > div",
    noResultsXPath: null,
    openSearchDefinition: {
      template:
        "https://www.houzz.com/products/query/{searchTerms}/nqrwns/p/{page}?oq={searchTerms}",
    },
    domain: "houzz.com",
    zipcode: "",
  },
};
