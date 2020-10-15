module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "TR",
    store: "teknosa",
    domain: "teknosa.com",
    url: "https://www.teknosa.com/arama/?{searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "",
  },
};
