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
      template:
        "https://www.houzz.com/products/query/{searchTerms}/nqrwns/p/{page}?oq={searchTerms}",
    },
    domain: "houzz.com",
    zipcode: "",
  },
};
