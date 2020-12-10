module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    url: null,
    loadedSelector: ".hz-image-container img",
    noResultsXPath: null,
    zipcode: "",
  },
};
