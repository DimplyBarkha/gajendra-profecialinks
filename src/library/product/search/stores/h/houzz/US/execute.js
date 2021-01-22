module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    url: "https://www.houzz.com/products/query/{shower-installation}",
    loadedSelector: "[type='application/ld+json']",
    noResultsXPath: null,
    zipcode: "",
  },
};
