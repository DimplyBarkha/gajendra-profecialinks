module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "IT",
    store: "ebay",
    domain: "ebay.it",
    url:
      "https://www.ebay.it/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw={searchTerms}&_sacat=0",
    loadedSelector: "ul.srp-results",
    noResultsXPath: '//h3[@class="grid-coincidences"]',
  },
};
