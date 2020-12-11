module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: ".hz-image-container img",
    noResultsXPath: null,
    openSearchDefinition: {
      offset: 36,
      template:
        "https://www.houzz.com/products/query/{searchTerms}/nqrwns/p/{offset}",
    },
    domain: "houzz.com",
    zipcode: "",
  },
};
