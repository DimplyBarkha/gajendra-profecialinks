
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'jbhifi',
    domain: 'jbhifi.co.nz',
    url: 'https://www.jbhifi.co.nz',
    loadedSelector: "div[class*='span03 product-tile']",
    noResultsXPath: "//div[contains(@id,'results-bar') and contains(.,'0 results')]",
    zipcode: '',
  },
};
