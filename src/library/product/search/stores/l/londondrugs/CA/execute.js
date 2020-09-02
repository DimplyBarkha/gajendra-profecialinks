module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "CA",
    store: "londondrugs",
    domain: "londondrugs.com",
    url: "https://www.londondrugs.com/search/?&start=0&sz=100&q={searchTerms}",
    loadedSelector: "div.product-details > a",
    noResultsXPath: '//div[@class="search-no-results"]',
    zipcode: "",
  },
};
