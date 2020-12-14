module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    url: "https://www.houzz.com/products/query/{searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "",
  },
};
