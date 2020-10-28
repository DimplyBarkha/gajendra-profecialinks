module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    url: "https://www.houzz.com/products/query/{rug}/nqrwns",
    loadedSelector:
      "#hz-br__result-set-root > div.hz-card.clearfix.hz-br__result-set > div:nth-child(3) > div > div",
    noResultsXPath: null,
    zipcode: "",
  },
};
