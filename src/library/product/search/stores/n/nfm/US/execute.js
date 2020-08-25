module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "nfm",
    domain: "nfm.com",
    url: "https://www.nfm.com/{searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "",
  },
};
