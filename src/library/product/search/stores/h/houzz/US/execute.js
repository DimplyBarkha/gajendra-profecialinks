module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    url: "https://www.houzz.com/products/query/{searchTerms}",
    loadedSelector: ".hz-image-container img",
    noResultsXPath: null,
    zipcode: "",
  },
};
