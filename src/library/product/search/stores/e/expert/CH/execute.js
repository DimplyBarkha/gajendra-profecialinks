
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    domain: 'digitec.ch',
    url: 'https://www.digitec.ch/de/search?q={searchTerms}',
    loadedSelector: "div[class*='productList'] article[class*='panelProduct']",
    noResultsXPath: "//p[contains(@class,'ZZsx') and contains(.,'No results')]",
    zipcode: '',
  },
};
