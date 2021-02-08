module.exports = {
  implements: "product/details/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    loadedSelector:"script[type='application/ld+json']",
    noResultsXPath: null,
    zipcode: "",
  },
};
